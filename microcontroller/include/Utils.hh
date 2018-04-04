#ifndef UTILS_HH_
# define UTILS_HH_

# include "Messages.hh"
# include "Output.hh"

# define STRINGIFY(X) #X
# define RANDOM_NBR_RANGE(MIN, MAX) (rand() % ((MAX > MIN) ?            \
                                               ((MAX - MIN) + MIN) :    \
                                               ((MIN - MAX) + MAX)))

# define MIN_VAL(A, B)              (A < B) ? (A) : (B)
# define CMD_AND_HOUSE_SEPARATOR    "::"

# define RETRY_SOFT                 2
# define RETRY_HARD                 5

/*
** TRY_EXECUTE_OR_RESET is not a function as X needs to be executed
** multiple TIMES and X cannot be a pointer to function as not
** all X take the same parameters. Also X could be more than just
** a function, an expression (which needs to be evaluated TIMES times).
** Another more proper solution could have been a function combined with
** VA_ARGS ?
*/
# define TRY_EXECUTE_OR_RESET(X, TIMES) \
    do { \
        error = X; \
        fprintf(stderr, COLOR_NONE "%s : %d\n", #X, error); \
        Thread::wait(500); \
    } while (error < 0 && ++counter < TIMES); if (error < 0) warn_reset(#X); else counter = 0;

void            warn_reset(const char * const mesg) __attribute__((noreturn));

#endif // !UTILS_HH_