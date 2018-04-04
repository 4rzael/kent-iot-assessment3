#ifndef CONFIG_HH_
# define CONFIG_HH_

/*
** commands control table
** The function name must be unique but other than that, the name itself is not
** important as those functions are created upon compilation.
**      COMMAND         MESG                    LED_COLOR   FUNCTION
*/
# define COMMANDS_CTRL_TABLE    \
  ENTRY(temp_up,        "heating up place",     red,        heat_up_place)   \
  ENTRY(temp_down,      "cooling down place",   blue,       cool_down_place)   \
  ENTRY(nutriments_up,  "boosting nutriments",  green,      boost_nutriments)   \
  ENTRY(nutriments_down,"decreasing nutriments",blue,       decrease_nutriments)   \
  ENTRY(water_plants,   "watering plants",      blue,       plants_watering)   \
/* !commands control table */

////////////////////////////////////////////////////////////////////////////////

/*
** connect options
*/
# define MQTT_BROKER_URL     "iot.4rzael.com"
# define MQTT_PORT           1883
# define MQTT_CLIENTID       "srjanel_from_microctl"
# define MQTT_TOPIC          "presence42"
# define MQTT_USERNAME       ""
# define MQTT_PASSWORD       ""
/* !connect options */

# define MESG_MICROC_FINISH  "[+] Microcontroller finished: "
# define TASK_TIME_MIN      7
# define TASK_TIME_MAX      15

#endif // !CONFIG_HH_