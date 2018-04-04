#ifndef OUTPUT_HH_
# define OUTPUT_HH_

# include "C12832.h"

typedef enum    color
{
    off,
    red,
    green,
    blue
}               e_color;

void            controlLED(e_color led_color);
void            display_screen(const char * const mesg, const char * const house);

#endif // !OUTPUT_HH_