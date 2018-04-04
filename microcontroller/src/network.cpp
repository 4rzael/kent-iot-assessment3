#include "Network.hh"
#include "Utils.hh"

static const char * const   g_houses[] = {
    "gh1_east",
    "gh1_south",
    "gh1_north",
    "gh1_west",
    
    "gh2_east",
    "gh2_south",
    "gh2_north",
    "gh2_west",

    "gh3_east",
    "gh3_south",
    "gh3_north",
    "gh3_west",

    "gh4_east",
    "gh4_south",
    "gh4_north",
    "gh4_west",
    NULL
};

char                house_exists(const char **house)
{
    size_t          i = 0;
    size_t          separator_size = strlen(CMD_AND_HOUSE_SEPARATOR);

    if (strlen(*house) > separator_size)
        *house += separator_size;
    while (g_houses[i] && strcmp(g_houses[i], *house))
        ++i;
    return (g_houses[i] ? 1 : 0);
}

void                recv_mesg(MQTT::MessageData &md)
{
    MQTT::Message   &message = md.message;
    ssize_t         command = -1;
    char            *command_string;
    char            *house;

# ifdef _DEBUG
    fprintf(stderr, "recv MQTT mesg:  %.*s\r\n", message.payloadlen,
            (const char *)message.payload);
    fprintf(stderr, "message.payloadlen: %ld\n", message.payloadlen);
# endif // !_DEBUG
# define CMD_MAX_SIZE   100
    if (!(command_string = (char *)malloc(sizeof(char)
        * (MIN_VAL(message.payloadlen, CMD_MAX_SIZE) + 1))))
        warn_reset(ERR_FATAL_MEM);
    strncpy(command_string, (const char *)message.payload,
            MIN_VAL(message.payloadlen, CMD_MAX_SIZE));
    command_string[MIN_VAL(message.payloadlen, CMD_MAX_SIZE)] = 0;
# undef CMD_MAX_SIZE
    while (++command < LIMIT)
        if (strlen(g_commands_ctrl[command].cmd) <= strlen(command_string)
            && !strncmp(g_commands_ctrl[command].cmd, command_string,
                        strlen(g_commands_ctrl[command].cmd)))
            break;
    if (command < LIMIT)
    {
        house = command_string + strlen(g_commands_ctrl[command].cmd);
        if (house_exists((const char **)&house))
        // if house valid then execute...
            g_commands_ctrl[command].function(house);
        else
            fprintf(stderr, ERR_UNKNOWN_HOUSE);
    }
    else
        fprintf(stderr, ERR_UNKNOWN_CMD);
    free(command_string);
}

void                send_mesg(const char *mesg)
{
    MQTT::Message   message;
# define BUFFER_SIZE    100
    char            buffer[BUFFER_SIZE] = {0};

    message.qos = MQTT::QOS0;
    message.retained = false;
    message.dup = false;
    message.payload = (void *)buffer;
    message.payloadlen = strlen(mesg);
    strncpy(buffer, mesg, BUFFER_SIZE - 1);
# undef BUFFER_SIZE
# ifdef _DEBUG
    fprintf(stderr, "message.payload: '%s'\n", (char *)message.payload);
    fprintf(stderr, "message.payloadlen: %ld\n", message.payloadlen);
# endif // !_DEBUG
    (void)g_client->publish(MQTT_TOPIC, message);
}