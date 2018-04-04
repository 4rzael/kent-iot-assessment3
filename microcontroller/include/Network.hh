#ifndef NETWORK_HH_
# define NETWORK_HH_

# include <string.h>
# include "MQTTClient.h"
# include "MQTTEthernet.h"
# include "Commands.hh"
# include "Messages.hh"
# include "Config.hh"

void                                            recv_mesg(MQTT::MessageData &md);
void                                            send_mesg(const char *mesg);
extern t_commands_ctrl                          g_commands_ctrl[];
extern MQTT::Client<MQTTEthernet, Countdown>    *g_client;

#endif // !NETWORK_HH_