#include "Output.hh"

DigitalOut  redLED(LED_RED);
DigitalOut  greenLED(LED_GREEN);
DigitalOut  blueLED(LED_BLUE);
C12832      g_lcd_sensor(D11, D13, D12, D7, D10);

void        display_screen(const char * const mesg,
                            const char * const house)
{
    g_lcd_sensor.cls();
    g_lcd_sensor.locate(0, 0);
    if (house)
        g_lcd_sensor.printf("%s@%s", mesg, house);
    else
        g_lcd_sensor.printf("%s", mesg);
}

void    controlLED(e_color led_color)
{
    switch (led_color)
    {
        case red:
            greenLED = blueLED = 1;
            redLED = 0.7;
            break;
        case green:
            redLED = blueLED = 1;
            greenLED = 0.7;
            break;
        case blue:
            redLED = greenLED = 1;
            blueLED = 0.7;
            break;
        case off:
            redLED = greenLED = blueLED = 1;
            break;
    }
}
