#ifndef COMMANDS_HH_
# define COMMANDS_HH_

# include <time.h>
# include <stdio.h>
# include <stdlib.h>
# include "Output.hh"
# include "Config.hh"
# include "Utils.hh"

enum {
# define ENTRY(ENUM, UNUSED1, UNUSED2, UNUSED3) ENUM,
  COMMANDS_CTRL_TABLE
# undef ENTRY
  LIMIT
};

typedef struct          s_commands_ctrl
{
  char                  *cmd;
  char                  *mesg;
  void                  (*function)(const char * const house);
}                       t_commands_ctrl;

/*
** Create prototypes
*/
#define ENTRY(UNUSED1, MESG, UNUSED2, FUNCTION) void FUNCTION(const char * const house);
  COMMANDS_CTRL_TABLE
# undef ENTRY

#endif // !COMMANDS_HH_