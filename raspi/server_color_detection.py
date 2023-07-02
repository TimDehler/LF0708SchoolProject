import cv2
import time
import math
import colorsys
import numpy as np
import socket
import pickle
import struct
import threading

# Port the camera does operate on
CAMERA_PORT = 0
# Color anchoring for HUE
COLOR_ANCHOR = [(230, 'blue'), (20, 'red'), (340, 'red'), (120, 'green')]
# Matrix to sharpen the image
KERNEL_SHARPEN = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
# DOBOT handling server
DOBOT_CONNECTION = ("10.62.255.4", 65432)
# Last sampled color shared across thread
LAST_COLOR_SAMPLE = "none"
# Increments each time the camera was updated
LAST_COLOR_INTERVAL = 0
# Stall camera until we have a connection
EVER_RECEIVED_CONNECTION = False

def dispatch(conn, data):
    print("dispatch: " + str(data))
    serialized_data = pickle.dumps(data)
    conn.sendall(struct.pack('>I', len(serialized_data)))
    conn.sendall(serialized_data)

def receive(conn):
    data_size = struct.unpack('>I', conn.recv(4))[0]
    payload = b""
    remaining = data_size
    while remaining != 0:
        payload += conn.recv(remaining)
        remaining = data_size - len(payload)
    data = pickle.loads(payload)
    print("receive: " + str(data))
    return data

def on_new_client(conn, addr):
    global LAST_COLOR_SAMPLE
    global LAST_COLOR_INTERVAL
    global EVER_RECEIVED_CONNECTION
    
    EVER_RECEIVED_CONNECTION = True
    
    print("Open session for: " + str(addr))
    try:
        # process handshake protocol
        data = receive(conn)
        if data["packet"] == "handshake":
            if data["version"] == 1:
                dispatch(conn, {"response": "acknowledge"})
            elif data["version"] == 2:
                dispatch(conn, {"response": "acknowledge"})
            else:
                dispatch(conn, {"response": "bad_version"})
                return;
        else:
            dispatch(conn, {"response": "expected_handshake", "dead": True})
            return;
        
        # await communication
        while True:
            data = receive(conn)
            if data["packet"] == "scan":
                # request to scan color and respond
                wanted_interval = LAST_COLOR_INTERVAL + 2
                while (LAST_COLOR_INTERVAL <= wanted_interval):
                    time.sleep(0.25)
                dispatch(conn, {"response": LAST_COLOR_SAMPLE})
            elif data["packet"] == "close":
                # request to terminate
                dispatch(conn, {"response": "goodbye", "dead": True})
                break;
            else:
                # unknown protocol
                dispatch(conn, {"response": "unknown_packet:" + data["packet"]})
                
            # stall so we do not kill process
            time.sleep(1)
    except socket.error as e:
        # ignore socket error
        print("Forceful connection termination: " + str(e))
    finally:
        # terminate connection
        conn.close()
        
def on_new_camera(port):
    global LAST_COLOR_SAMPLE
    global LAST_COLOR_INTERVAL
    global EVER_RECEIVED_CONNECTION
    
    # one thread to sample camera
    while True:
        if EVER_RECEIVED_CONNECTION:
            camera = cv2.VideoCapture(port)
            r,g,b = sample(camera)
            h,s,v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
            h,s,v = (int(h*360),int(s*100),int(v*100))
            LAST_COLOR_SAMPLE = getNameOfHue(h)
            LAST_COLOR_INTERVAL = LAST_COLOR_INTERVAL + 1
            camera.release()

        
def launch():
    # initialize camera
    print("initialise camera")
    threading.Thread(target=on_new_camera, args=(CAMERA_PORT,), daemon=True).start()
    # initialize communication protocol
    print("prepare listener")
    skt = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    skt.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    skt.bind(DOBOT_CONNECTION)
    skt.listen(5)

    try:        
        # initialise every connection on its own thread
        while True:
            conn, addr = skt.accept()
            threading.Thread(target=on_new_client, args=(conn, addr), daemon=True).start()
    finally:
        # terminate resources we are processing
        skt.close()
        cv2.destroyAllWindows()

def sample(camera):
    if camera.isOpened():
        # multipe flushes to calibrate camera
        ret, frame = camera.read()
        # terminate if camera has no more feedback
        if not ret:
            return

        frame = enhanceImage(frame)
        #cv2.imshow("debug", frame)
        #cv2.waitKey(0)
        #cv2.destroyAllWindows()

        # compute predominant color
        _r, _g, _b = 0.0, 0.0, 0.0
        _h, _s, _v = 0.0, 0.0, 0.0
        weight = 0.0
        hue = 0.0
        shape = frame.shape
        for x in range(0, shape[0]):
            for y in range(0, shape[1]):
                # RGB extraction
                r = frame.item(x, y, 2)
                g = frame.item(x, y, 1)
                b = frame.item(x, y, 0)
                # transform to hsv
                hsv = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
                # color weight, center is more important
                w1 = 1 / math.sqrt(1 + math.fabs((shape[0] / 2.0) - x))
                w2 = 1 / math.sqrt(1 + math.fabs((shape[1] / 2.0) - y))
                local_weight = 0.5 * w1 + 0.5 + w2
                # sum with weighted hsv code
                weight += local_weight
                _r += r * local_weight
                _g += g * local_weight
                _b += b * local_weight
        # offer the data extracted
        return (int(_r/local_weight), int(_g/local_weight), int(_b/local_weight))
    else:
        return (0, 0, 0)

def getNameOfHue(hue):
    closest_distance = 99999
    closest_name = 'Unknown'
    for (anchor, name) in COLOR_ANCHOR:
        diff = math.fabs(hue - anchor)
        if diff < closest_distance:
            closest_distance = diff
            closest_name = name
    return closest_name

def enhanceImage(image):
    # converting to LAB color space
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l_channel, a, b = cv2.split(lab)

    # Applying CLAHE to L-channel
    # feel free to try different values for the limit and grid size:
    clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(12, 12))
    cl = clahe.apply(l_channel)

    # merge the CLAHE enhanced L-channel with the a and b channel
    limg = cv2.merge((cl, a, b))

    # Converting image from LAB Color model to BGR color spcae
    enhanced_img = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    # Stacking the original image with the enhanced image
    return enhanced_img

launch()

