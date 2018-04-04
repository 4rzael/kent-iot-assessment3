#include "Utils.hh"

void                    warn_reset(const char * const mesg)
{
    ERR_WITH_ARGS(ERR_FATAL_ERROR_WHILE, mesg);
    display_screen(ERR_FATAL_RESET, NULL);
    wait(4);
    NVIC_SystemReset();
    abort(); /* If for some mystical reason NVIC_SystemReset() does not reset
                the device */
}