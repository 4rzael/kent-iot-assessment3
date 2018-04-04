#include "App.hh"

int                     main(void)
{
    size_t              counter = 0;
    int                 error;

    controlLED(off);
    srand(time(NULL));
    fprintf(stdout, MESG_WELCOME);
    fprintf(stdout, MESG_ATTEMPT_CONN_LAN);
    MQTTEthernet mqtt_ether = MQTTEthernet();
    EthernetInterface &eth = mqtt_ether.getEth();
#ifdef _DEBUG
    fprintf(stderr, "IP addr: %s\n", eth.getIPAddress());
    fprintf(stderr, "MAC addr: %s\n", eth.getMACAddress());
    fprintf(stderr, "Gateway addr: %s\n", eth.getGateway());
#endif //!_DEBUG
    g_client = new MQTT::Client<MQTTEthernet, Countdown>(mqtt_ether);
    TRY_EXECUTE_OR_RESET(mqtt_ether.connect(MQTT_BROKER_URL, MQTT_PORT), RETRY_HARD);
    MESG_WITH_ARGS(MESG_CONNECTED_SERVER_TCP, MQTT_BROKER_URL, MQTT_PORT);
    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;
    data.MQTTVersion = 3;
    data.clientID.cstring = MQTT_CLIENTID;
    TRY_EXECUTE_OR_RESET(g_client->connect(data), RETRY_SOFT);
    MESG_WITH_ARGS(MESG_CONNECTED_SERVER_MQTT, MQTT_BROKER_URL, MQTT_PORT);
    TRY_EXECUTE_OR_RESET(g_client->subscribe(MQTT_TOPIC, MQTT::QOS0, recv_mesg), RETRY_SOFT);
    MESG_WITH_ARGS(MESG_SUBSCRIBED_MQTT_TOPIC, MQTT_TOPIC);
    while (true)
        g_client->yield(100);
}
