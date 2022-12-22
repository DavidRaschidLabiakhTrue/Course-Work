#include "UnlistedClassHeaderDueToLegalReasons.h"
#include <stdio.h>
#include <string.h>
#include <stdbool.h>



void printProcessedString(char *str);
int process_GCharacterCount(char *str, int *index_pointer);
double printGCharacterCount(int numGCharacterCount);
void loop_print_GCharacterCount(int N_loop);
void verify_OCharacter_existence(double height_of_ProcessedString, int numGCharacterCount, char *str, int string_length);


int main(int argc, char **argv)
{
    if (argc<2)
    {
      return 0;
    }
    printProcessedString(argv[1]);
    return 0;
}

void printProcessedString(char *str)
{
    int string_length = strlen(str);
    double height_of_ProcessedString = 0;
    int index;
    int *index_pointer = &index;
    int numGCharacterCount = 0;

    if (str[0] == '\0' || strcmp(str, "") == 0 )
    {
        printf("No cookie. :(\n");
        return;
    }

    for (index = 0 ; index<string_length; index++)
    {
        switch (str[index])
        {
            case 'o':
                printf("==========\n");
                height_of_ProcessedString = height_of_ProcessedString+.4;
              break;
            case 'c':
                printf(" ~~~~~~~~\n");
                height_of_ProcessedString = height_of_ProcessedString+.25;
              break;
            case 'g':
                  numGCharacterCount = process_GCharacterCount(str, index_pointer);
                  height_of_ProcessedString = height_of_ProcessedString + printGCharacterCount(numGCharacterCount);
                break;
            default:
                break;

        }
    }
    index_pointer = NULL;
    verify_OCharacter_existence(height_of_ProcessedString, numGCharacterCount, str, string_length);
    return;
}

int process_GCharacterCount(char *str, int *index_pointer)
{
      int jindex_initial = *index_pointer;
      int jindex = *index_pointer;
      int N_GCharacterCount_sequence = 1;
      int height_sum = 0;
      while( (str[jindex+1] == 'g') && (str[jindex+1] != '\0') )
      {
          jindex++;
          N_GCharacterCount_sequence++;
      }
      *index_pointer += (jindex-jindex_initial);
      return N_GCharacterCount_sequence;
}

double printGCharacterCount(int numGCharacterCount)
{
    int fishy_remainder = numGCharacterCount%3;
    int sleep_safely = 0;
    bool one_test = false;


    switch (fishy_remainder)
    {
        case 0:
            loop_print_GCharacterCount(numGCharacterCount/3);
            return .25*(( (double)numGCharacterCount)/3 );
        case 1:
            numGCharacterCount >= 4 ?  loop_print_GCharacterCount( (numGCharacterCount-4)/3 )  : printf("  .,.,.,\n") ;
            if (numGCharacterCount >= 4)
            {
                printf("xoxoxoxoxo\n");
            }
            one_test = numGCharacterCount >= 4 ?  true : false;
            if (one_test == true)
            {
                return .25*(( (double)(numGCharacterCount-1) )/3);
            }
            else
            {
                return .1;
            }
        case 2:
            printf("  xoxoxo\n");
            loop_print_GCharacterCount( (numGCharacterCount-2)/3);
            return .25*(( (double)(numGCharacterCount+1) )/3);
    }
}
void loop_print_GCharacterCount(int N_loop)
{
  int kindex;
  for (kindex = 0; kindex < N_loop; kindex++)
    {
        printf(" xoxoxoxo\n");
    }
    return;

}
void verify_OCharacter_existence(double height_of_ProcessedString, int numGCharacterCount, char *str, int string_length)
{
    if (height_of_ProcessedString>.1 && (str[0] == 'o' && str[string_length-1] == 'o'))
    {
        if (height_of_ProcessedString <= 4.0)
        {
            if(numGCharacterCount > 0)
            {
                printf("Om nom nom! ProcessedString!\n");
                return;
            }
            else
            if(numGCharacterCount == 0)
            {
                printf("Om nom nom! OCharacter!\n");
                return;
            }
        }
        else
        if (height_of_ProcessedString > 4.0)
        {
            printf("Oh nooooo! Too tall. :(\n");
            return;
        }
    }
    else
    if (height_of_ProcessedString >= .1 && (str[0] != 'o' || str[string_length-1] != 'o'))
    {
        printf("Too messy. :(\n");
        return;
    }
}

