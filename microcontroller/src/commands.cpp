#include <sstream>
#include "Commands.hh"
#include "Network.hh"

unsigned long long   g_mesg_counter = 0;

/*
** An array to be able to loop through functions once they are created
** during runtime.
*/
t_commands_ctrl     g_commands_ctrl[LIMIT] = {
# define ENTRY(ENUM, MESG, UNUSED1, FUNCTION) {STRINGIFY(ENUM), MESG, FUNCTION},
    COMMANDS_CTRL_TABLE
# undef ENTRY
};

# define ENTRY(UNUSED1, MESG, LED_COLOR, FUNCTION) void FUNCTION(const char * const house) { \
    std::stringstream           ss;                                     \
    controlLED(LED_COLOR);                                              \
    display_screen("[*] " MESG, house);                                 \
    fprintf(stdout, "[*] %s@%s\n", MESG, house);                        \
    wait(RANDOM_NBR_RANGE(TASK_TIME_MIN, TASK_TIME_MAX));               \
    display_screen(MESG_LAST_ACTION MESG, house);                       \
    ss << MESG_MICROC_FINISH << MESG << "::" << ++g_mesg_counter;       \
    send_mesg(ss.str().c_str());                                        \
    controlLED(off);                                                    \
  }
    COMMANDS_CTRL_TABLE
# undef ENTRY