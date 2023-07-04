# OPCUA-Server 
# by Hubert Vey 2021

# Beschreibung:
# https://github.com/FreeOpcUa/python-opcua/issues/803
# https://github.com/FreeOpcUa/python-opcua/blob/master/examples/server-example.py

import asyncio
import asyncua
from asyncua import ua, Server
from asyncua.ua import ObjectIds
from datetime import datetime
import board
import time
import netifaces as ni
import adafruit_dht
import RPi.GPIO as GPIO

async def initServer():
    # Zählweise der Pins festlegen
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    sensorPin = 4

    interface = 'wlan0'

    #GPIO Eingänge festlegen
    GPIO.setup(sensorPin, GPIO.IN)

    # Device für Sensor 
    dhtDevice = adafruit_dht.DHT22(board.D4, use_pulseio=False)

    #Server Objekt anlegen und IP/Ports angeben
    server = Server()
    await server.init()

    #Get the ip address
    IPV4_Address = ni.ifaddresses(interface)[ni.AF_INET][0]['addr']
    url="opc.tcp://"+IPV4_Address+":4840"
    server.set_endpoint(url)

    # Securityeinstellung "keine Sicherheit" für Clients angeben kann auch weggelassen werden
    server.set_security_policy([ua.SecurityPolicyType.NoSecurity])

    # setup our own namespace, not really necessary but should as spec
    uri="http://examples.freeopcua.github.io"
    addspace=await server.register_namespace(uri)

    # create a new node type we can instantiate in our address space
    dev = await server.nodes.base_object_type.add_object_type(addspace, "FBS-Platine")
    await (await dev.add_variable(addspace, "temperature", 0.0)).set_modelling_rule(True)
    await (await dev.add_variable(addspace, "humidity", 0.0)).set_modelling_rule(True)

    # First a folder to organise our nodes
    myfolder = await server.nodes.objects.add_folder(addspace, "Raspi")
    # instanciate one instance of our device
    mydevice = await myfolder.add_object(addspace, "FBS-Platine", dev)
    # get proxy to child-elements
    opc_temperature = await mydevice.get_child([f"{addspace}:temperature"])
    opa_humidity = await mydevice.get_child([f"{addspace}:humidity"])    

    #OPCUA-Server starten
    async with server:   
        print("Server startet auf " + format(url))

        while True:
            try:
                # Print the values to Console
                temperature = dhtDevice.temperature
                humidity = dhtDevice.humidity
                print(f"Temp: {temperature:.1f}°C Humidity: {humidity}%")
                # OPCUA-Nodes setzen
                await opc_temperature.write_value(temperature)
                await opa_humidity.write_value(humidity)
            except RuntimeError as error:
                # Errors happen fairly often, DHT's are hard to read, just keep going
                print(error.args[0])
                await asyncio.sleep(2.0)
                continue
            except Exception as error:
                dhtDevice.exit()
                raise error        
        
            await asyncio.sleep(2.0)


if __name__ == "__main__":
    # initialize server
    asyncio.run(initServer())
        
