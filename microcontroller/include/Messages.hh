#ifndef MESSAGES_HH_
# define MESSAGES_HH_

/*
** Colors
*/
# define COLOR_RED                  "\033[1;31m"
# define COLOR_GREEN                "\033[1;32m"
# define COLOR_NONE                 "\033[1;0m"
/* !Colors */

/*
** Messages
*/
# define MESG_WELCOME               COLOR_GREEN "\n[+] WELCOME" COLOR_NONE "\n"
# define MESG_CONNECTED_SERVER_TCP  COLOR_GREEN "[+] Connected to server (TCP) (%s:%d)" COLOR_NONE "\n"
# define MESG_ATTEMPT_CONN_LAN      COLOR_GREEN "[*] Attempting connection to local network..." COLOR_NONE "\n"
# define MESG_CONNECTED_SERVER_MQTT COLOR_GREEN "[+] Connected to server (MQTT) (%s:%d)" COLOR_NONE "\n"
# define MESG_SUBSCRIBED_MQTT_TOPIC COLOR_GREEN "[+] Subscribed to MQTT topic %s" COLOR_NONE "\n"
# define MESG_LAST_ACTION           "[+] Last action:\n"
# define MESG_WITH_ARGS(FMT, ...)   fprintf(stdout, FMT, ##__VA_ARGS__)
/* !Messages */

/*
** Errors
*/
# define ERR_UNKNOWN_CMD            COLOR_RED "[-] Unknown command" COLOR_NONE "\n"
# define ERR_UNKNOWN_HOUSE          COLOR_RED "[-] Unknown house" COLOR_NONE "\n"
# define ERR_FATAL_MEM              COLOR_RED "[-] FATAL ERROR: Could not allocate memory" COLOR_NONE "\n"
# define ERR_FATAL_ERROR_WHILE      COLOR_RED "[-] FATAL ERROR: while %s\n[*] Restarting.." COLOR_NONE
# define ERR_FATAL_RESET            "[-] FATAL ERROR: restarting.."
# define ERR_WITH_ARGS(FMT, ...)    fprintf(stderr, FMT, ##__VA_ARGS__)
/* !Errors */

#endif // !MESSAGES_HH_