#ifndef APP_HH_
# define APP_HH_

# include "MQTTEthernet.h"
# include "Commands.hh"
# include "Network.hh"
# include "Output.hh"
# include "Config.hh"
# include "Utils.hh"

MQTT::Client<MQTTEthernet, Countdown> *g_client = NULL;

#endif // !APP_HH_