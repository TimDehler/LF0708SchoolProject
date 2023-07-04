import random
import DoBotArm as Dbt
import os
import datetime
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import socket, pickle, struct
import threading, asyncio
import paho.mqtt.client as mqtt
import json
from asyncua import Client
import asyncio
import time

# Base coordinates for defining the starting point for every process
baseX, baseY, baseZ = 200.0, 0.0, 0.0

# Color count for continous stacking if the same color appears multiple times (3 stack max)
redCount = 0
blueCount = 0
greenCount = 0

# Wuerfel Coordinates
#----------------------------------------------------------------------------------------------
wuerfelEinsX, wuerfelEinsY, wuerfelEinsZ = -50.0, -280.0, 20.0
wuerfelEinsXDown, wuerfelEinsYDown, wuerfelEinsZDown = -50.0, -280.0, -50.0
    
wuerfelZweiX, wuerfelZweiY, wuerfelZweiZ = -10.0, -280.0, 20.0
wuerfelZweiXDown, wuerfelZweiYDown, wuerfelZweiZDown = -5.0, -280.0, -50.0
    
wuerfelDreiX, wuerfelDreiY, wuerfelDreiZ = 40.0, -280.0, 20.0
wuerfelDreiXDown, wuerfelDreiYDown, wuerfelDreiZDown = 40.0, -280.0, -50.0
    
cameraX, cameraY, cameraZ = 230.0, 0.0, 20.0
cameraXDown, cameraYDown, cameraZDown = 230.0, 0.0, -50.0
        
ablageRotX, ablageRotY, ablageRotZ = 20.0, 250.0, 20.0
ablageRotXDown, ablageRotYDown, ablageRotZDown = 20.0, 250.0, -50.0

ablageGruenX, ablageGruenY, ablageGruenZ = 60.0, 250.0, 20.0
ablageGruenXDown, ablageGruenYDown, ablageGruenZDown = 60.0, 250.0, -50.0

ablageBlauX, ablageBlauY, ablageBlauZ = 100.0, 250.0, 20.0
ablageBlauXDown, ablageBlauYDown, ablageBlauZDown = 100.0, 250.0, -50.0
#----------------------------------------------------------------------------------------------
# /Wuerfel Coordinates



# Dobot functions
#----------------------------------------------------------------------------------------------
def createDobot():
    baseX, baseY, baseZ = 200.0, 0.0, 0.0
    return Dbt.DoBotArm(baseX, baseY, baseZ)

def getCube(ctrlBot,cubeX, cubeY, cubeZ, cubeXDown, cubeYDown, cubeZDown):
    ctrlBot.moveArmXYZ(cubeX, cubeY, cubeZ)
    ctrlBot.moveArmXYZ(cubeXDown, cubeYDown, cubeZDown)
    ctrlBot.toggleSuction()
    ctrlBot.moveArmXYZ(cubeX, cubeY, cubeZ)
    ctrlBot.moveArmXYZ(cameraX, cameraY, cameraZ)
    ctrlBot.moveArmXYZ(cameraXDown, cameraYDown, cameraZDown)
    ctrlBot.toggleSuction()
    ctrlBot.moveArmXYZ(cameraX, cameraY, cameraZ)
    
def moveToStorage(ctrlBot, s):
    global redCount
    global greenCount
    global blueCount
    
    color = getColor(s)
    ctrlBot.moveArmXYZ(cameraXDown, cameraYDown, cameraZDown)
    ctrlBot.toggleSuction()
    ctrlBot.moveArmXYZ(cameraX, cameraY, cameraZ)
    
    if color == "red":
        if redCount > 0:
            redCount += 1
            ctrlBot.moveArmXYZ(ablageRotX, ablageRotY, ablageRotZ)
            ctrlBot.moveArmXYZ(ablageRotXDown, ablageRotYDown, ablageRotZDown+(redCount*50-70))
            ctrlBot.toggleSuction()
            ctrlBot.moveArmXYZ(ablageRotX, ablageRotY, ablageRotZ)
        elif redCount == 0:
            redCount += 1
            ctrlBot.moveArmXYZ(ablageRotX, ablageRotY, ablageRotZ)
            ctrlBot.moveArmXYZ(ablageRotXDown, ablageRotYDown, ablageRotZDown)
            ctrlBot.toggleSuction()
            ctrlBot.moveArmXYZ(ablageRotX, ablageRotY, ablageRotZ)
        
    if color == "blue":
        if blueCount > 0:
            blueCount += 1
            ctrlBot.moveArmXYZ(ablageBlauX, ablageBlauY, ablageBlauZ)
            ctrlBot.moveArmXYZ(ablageBlauXDown, ablageBlauYDown, ablageBlauZDown+(blueCount*50-70))
            ctrlBot.toggleSuction()
            ctrlBot.moveArmXYZ(ablageBlauX, ablageBlauY, ablageBlauZ)
        elif blueCount == 0:        
            blueCount += 1
            ctrlBot.moveArmXYZ(ablageBlauX, ablageBlauY, ablageBlauZ)
            ctrlBot.moveArmXYZ(ablageBlauXDown, ablageBlauYDown, ablageBlauZDown)
            ctrlBot.toggleSuction()
            ctrlBot.moveArmXYZ(ablageBlauX, ablageBlauY, ablageBlauZ)
            
    if color == "green":
        if greenCount > 0:
            greenCount += 1
            ctrlBot.moveArmXYZ(ablageGruenX, ablageGruenY, ablageGruenZ)
            ctrlBot.moveArmXYZ(ablageGruenXDown, ablageGruenYDown, ablageGruenZDown+(greenCount*50-70))
            ctrlBot.toggleSuction()
            ctrlBot.moveArmXYZ(ablageGruenX, ablageGruenY, ablageGruenZ)
        elif greenCount == 0:
            greenCount += 1
            ctrlBot.moveArmXYZ(ablageGruenX, ablageGruenY, ablageGruenZ)
            ctrlBot.moveArmXYZ(ablageGruenXDown, ablageGruenYDown, ablageGruenZDown)
            ctrlBot.toggleSuction()
            ctrlBot.moveArmXYZ(ablageGruenX, ablageGruenY, ablageGruenZ)

def roboCode(s):
    
    myDobot = createDobot()
    myDobot.moveHome()
    myDobot.moveArmXYZ(baseX, baseY, baseZ)

    getCube(myDobot, wuerfelEinsX, wuerfelEinsY, wuerfelEinsZ, wuerfelEinsXDown, wuerfelEinsYDown, wuerfelEinsZDown)
    moveToStorage(myDobot, s)
    myDobot.moveArmXYZ(baseX, baseY, baseZ)
    getCube(myDobot, wuerfelZweiX, wuerfelZweiY, wuerfelZweiZ, wuerfelZweiXDown, wuerfelZweiYDown, wuerfelZweiZDown)
    moveToStorage(myDobot, s)
    myDobot.moveArmXYZ(baseX, baseY, baseZ)
    getCube(myDobot, wuerfelDreiX, wuerfelDreiY, wuerfelDreiZ, wuerfelDreiXDown, wuerfelDreiYDown, wuerfelDreiZDown )
    moveToStorage(myDobot, s)
    myDobot.moveArmXYZ(baseX, baseY, baseZ)
#----------------------------------------------------------------------------------------------
# /Dobot functions



# Color detection & socket connection functions 
#----------------------------------------------------------------------------------------------    
def dispatch(conn, data):
    serialized_data = pickle.dumps(data)
    conn.sendall(struct.pack('>I', len(serialized_data)))
    conn.sendall(serialized_data)
    print("dispatch " + str(data))

def receive(conn):
    data_size = struct.unpack('>I', conn.recv(4))[0]
    received_payload = b""
    reamining_payload_size = data_size
    while reamining_payload_size != 0:
        received_payload += conn.recv(reamining_payload_size)
        reamining_payload_size = data_size - len(received_payload)
    data = pickle.loads(received_payload)
    print("received " + str(data))
    return data

def getColor(s):
    # request the color
    dispatch(s, {"packet":"scan"})
    return receive(s)["response"]
#----------------------------------------------------------------------------------------------
# /Color detection & socket connection functions



# Database Connection and Data collection
#----------------------------------------------------------------------------------------------
def dataBaseConnection(data_to_insert):
    # MongoDB connection details
    mongodb_uri = 'mongodb://10.100.20.145:27017' #Connection string for the mongos router
    database_name = 'testdatenbank'
    collection_name = 'testcollection'

    # Connect to MongoDB cluster
    try:
        client = MongoClient(mongodb_uri)
        print('Connected to MongoDB successfully')
    except ConnectionFailure as e:
        print('Could not connect to MongoDB:', str(e))
        exit()

    try:
        # Access the desired database and collection
        db = client[database_name]
        collection = db[collection_name]
    except e:
        print("database or collection name invalid")

    result = collection.insert_one(data_to_insert)
    print('Inserted document ID:', result.inserted_id)
    
    # Disconnect from MongoDB
    client.close()
#----------------------------------------------------------------------------------------------
# /Database Connection  and Data collection



# Async function to get the temperature data
#----------------------------------------------------------------------------------------------
async def __internal_opcua_request():
    uri = "http://examples.freeopcua.github.io"

    # prepare URL to connect upon
    interface = 'wlan0'
    #IPV4_Address = ni.ifaddresses(interface)[ni.AF_INET][0]['addr']
    IPV4_Address = "10.62.255.4"
    url="opc.tcp://"+IPV4_Address+":4840"
    # attempt to connect to server
    client = Client(url)
    # communicate to server
    async with client:
        idx = await client.get_namespace_index(uri)
        root = client.get_root_node()
        # identify OPCUA objects
        opc_temperature = await root.get_child(["0:Objects", "{}:Raspi".format(idx), "{}:FBS-Platine".format(idx), "{}:temperature".format(idx)])
        opc_humidity = await root.get_child(["0:Objects", "{}:Raspi".format(idx), "{}:FBS-Platine".format(idx), "{}:humidity".format(idx)])
        # tuple like (temperature, humidity)
        return (await (opc_temperature.get_value()), await (opc_humidity.get_value()))
        
def getDataFromOPCUA(stopEvent, data):
    # wrapper function to utilise OPCUA
    while not stopEvent.is_set():
        temperature, humidity = asyncio.run(__internal_opcua_request())
        data.append((temperature, humidity))
        time.sleep(0.1);

#----------------------------------------------------------------------------------------------
# Async function to get the temperature data



# Util functions
#----------------------------------------------------------------------------------------------
def format_time(time_to_format):
    return time_to_format.strftime("%d/%m/%Y %H:%M/%S")

def calculate_process_time(start_time, end_time):
    return round((end_time - start_time).total_seconds(), 2)


def createDocumentForDBSInsert(start_time, end_time, temperatures, humidities):
    time_taken = str(calculate_process_time(start_time, end_time)) + " seconds"
    return {
        "start_time": format_time(start_time),
        "end_time": format_time(end_time),
        "time_taken": time_taken,
        "colors_sorted": [
            {"color": "red", "amount": redCount},
            {"color": "blue", "amount": blueCount},
            {"color": "green", "amount": greenCount}
        ],
    "avg_temperature": (sum(temperatures) / len(temperatures)),
    "max_temperature": max(temperatures),
    "min_temperature": min(temperatures),
    "avg_humidity": (sum(humidities) / len(humidities)),
    "max_humidity": max(humidities),
    "min_humidity": min(humidities)
    }
#----------------------------------------------------------------------------------------------
# Util functions



# MQTT publisher
#----------------------------------------------------------------------------------------------
def writeToMQTT(dataObject):
    mqtt_client = mqtt.Client("data-publisher")
    mqtt_client.connect("10.100.20.145", 1883)    
    mqtt_client.publish("planlosV2/data", json.dumps(dataObject))
    mqtt_client.disconnect()
#----------------------------------------------------------------------------------------------
# MQTT publisher



# Main Programm
#----------------------------------------------------------------------------------------------
def main():
    # start opcua data collection
    opcua_terminate = threading.Event()
    opcua_data = []
    opcua_thread = threading.Thread(target=getDataFromOPCUA, args=[opcua_terminate, opcua_data])
    opcua_thread.start()
    print("collecting opcua data has started ...")
    
    start_time = datetime.datetime.now()
    print("Start time: " + format_time(start_time))
    
    RASPI_CONNECTION = ("10.62.255.4", 65432)
    s = socket.create_connection(RASPI_CONNECTION)

    # perform handshake with the raspi
    dispatch(s, {"packet":"handshake", "version":1})
    response = receive(s)
    
    # run the color sorting
    roboCode(s)
    
    # terminate connection
    dispatch(s, {"packet":"close"})
    response = receive(s)
    s.close()
    
    end_time = datetime.datetime.now()
    print("End time: " + format_time(end_time))
        
    # finish opcua data collection
    opcua_terminate.set()
    opcua_thread.join()
    temperatures = [temperature for (temperature, humidity) in opcua_data]
    humidities = [humidity for (temperature, humidity) in opcua_data]
    
    # write to MQTT
    writeToMQTT(createDocumentForDBSInsert(start_time, end_time, temperatures, humidities))

    # write to database
    dataBaseConnection(createDocumentForDBSInsert(start_time, end_time, temperatures, humidities))
    print("Main program finished")
#----------------------------------------------------------------------------------------------
# Main Programm

main()
