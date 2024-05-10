import paho.mqtt.client as mqtt
broker_url = "broker.hivemq.com"
broker_port = 1883
message_list = []
mess_rec_count = 0
file_count = 0
def on_connect(client, userdata, flags, reason_code, properties):
    print("[INFO] Connected With Result Code: " + str(reason_code))

def on_message(client, userdata, message):
    global file_count
    global message_list
    global mess_rec_count
    print("--- Subscriber ---")
    print("[INFO] Topic: {}".format(message.topic) )
    print("[INFO] Message Recieved: {}".format(message.payload.decode()))
    message_data = message.payload.decode()
    message_list.append(message_data)
    mess_rec_count +=1
    if mess_rec_count%5==0:
        try:
            with open(f"outfile-{file_count%100}.csv", "w") as outfile:
                outfile.write("\n".join(message_list))
            print("File Created",file_count%100)
        except:
            print("Error in File Creation",file_count%100)
            pass
        message_list=[]
        file_count+=1


    print("------------")

sub_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
print("A")
sub_client.on_connect = on_connect
print("B")
sub_client.on_message = on_message
print("C")
sub_client.connect(broker_url, broker_port)
print("D")
sub_client.subscribe("/mqtt/eyrc/vb/", qos=0)
print("E")
sub_client.loop_forever()
print("F")
print("Out of Loop. Exiting..")