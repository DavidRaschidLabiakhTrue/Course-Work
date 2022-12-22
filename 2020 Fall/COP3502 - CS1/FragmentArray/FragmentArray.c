#include "UnlistedClassHeaderDueToLegalReasons.h"
#include <stdio.h>
#include <stdlib.h>

#define sys_int    sizeof(int)
#define sys_p_int  sizeof(int*)
#define sys_LPA    sizeof((FragmentArray )
#define sys_p_LPA  sizeof((FragmentArray *)

FragmentArray *createFragmentArray(int num_fragments, int fragment_length);
FragmentArray *destroyFragmentArray(FragmentArray *fragmentArray);
FragmentArray *resetFragmentArray(FragmentArray *fragmentArray);
FragmentArray *cloneFragmentArray(FragmentArray *fragmentArray);

void get_parameters(FragmentArray *fragmentArray,int index, int *i, int *j, int *index_max_limit);
void NULL_detection(char *type);
void INVALID_detection(int index, int i, int j, char *type);
int linear_search(FragmentArray *fragmentArray, int key, int for_loop_INDEX);

int set(FragmentArray *fragmentArray, int index, int key);
int get(FragmentArray *fragmentArray, int index);
int delete(FragmentArray *fragmentArray, int index);
int containsKey(FragmentArray *fragmentArray, int key);
int isSet(FragmentArray *fragmentArray, int index);
int printIfValid(FragmentArray *fragmentArray, int index);
int getSize(FragmentArray *fragmentArray);
int getCapacity(FragmentArray *fragmentArray);
long long unsigned int getArraySizeInBytes(FragmentArray *fragmentArray);

FragmentArray *createFragmentArray(int num_fragments, int fragment_length)
{
    int for_loop_INDEX;
    FragmentArray *fragmentArray;
    if (num_fragments <= 0 || fragment_length <= 0)
    {   return NULL;                              }
    fragmentArray = malloc(sys_LPA);
    if (fragmentArray == NULL)
    {
        free(fragmentArray);
        return NULL;
    }
    fragmentArray->num_fragments        = num_fragments;
    fragmentArray->fragment_length      = fragment_length;
    fragmentArray->size                 = 0;
    fragmentArray->num_active_fragments = 0;
    fragmentArray->fragments            = malloc(sys_p_int * num_fragments);
    fragmentArray->fragment_sizes       = malloc(sys_int   * num_fragments);
    for (for_loop_INDEX = 0; for_loop_INDEX < num_fragments; for_loop_INDEX++)
    {
        fragmentArray->fragments[for_loop_INDEX]      = NULL;
        fragmentArray->fragment_sizes[for_loop_INDEX] = 0;
    }
    if (fragmentArray->fragments == NULL || fragmentArray->fragment_sizes == NULL)
    {
        free(fragmentArray->fragments);
        free(fragmentArray->fragment_sizes);
        free(fragmentArray);
        return NULL;
    }
    printf("-> A new FragmentArray has emerged from the void. (capacity: %d, fragments: %d)\n",
          num_fragments * fragment_length, num_fragments);
    return fragmentArray;
}

void get_parameters(FragmentArray *fragmentArray, int index, int *i, int *j, int *index_max_limit)
{
    *i = index / fragmentArray->fragment_length;
    *j = index - (*i) * fragmentArray->fragment_length;
    *index_max_limit = (fragmentArray->num_fragments * fragmentArray->fragment_length) -1;
}

void NULL_detection(char *type)
{   printf("-> Bloop! NULL pointer detected in %s().\n", type); }
void INVALID_detection(int index, int i, int j, char *type)
{
    printf("-> Bloop! Invalid access in %s(). (index: %d, fragment: %d, offset: %d)\n",
          type, index,i, j);
}
int linear_search(FragmentArray *fragmentArray, int key, int for_loop_INDEX)
{
    int for_loop_JINDEX;
    int length_of_a_frag = fragmentArray->fragment_length;
    for (for_loop_JINDEX = 0; for_loop_JINDEX < length_of_a_frag; for_loop_JINDEX++)
    {
        if (fragmentArray->fragments[for_loop_INDEX][for_loop_JINDEX] == key)
        {   return 1;                                               }
    }
    return 0;
}
FragmentArray *destroyFragmentArray(FragmentArray *fragmentArray)
{
    int for_loop_INDEX;
    int N_fragments = fragmentArray->num_fragments;
    if (fragmentArray == NULL)
    {   return NULL; }
    for (for_loop_INDEX = 0; for_loop_INDEX < N_fragments; for_loop_INDEX++)
    {   free(fragmentArray->fragments[for_loop_INDEX]);                            }
    // Free fragments pointer, fragment_sizes and fragmentArray from their mortal coil
    free(fragmentArray->fragments);
    free(fragmentArray->fragment_sizes);
    free(fragmentArray);
    printf("-> The FragmentArray has returned to the void.\n");
    return NULL;
}
int set(FragmentArray *fragmentArray, int index, int key)
{
    int length_of_a_frag;
    int i;
    int j;
    int high_index_parameter;
    int low_index_parameter;
    int index_max_limit;
    int for_loop_INDEX;
    if (fragmentArray == NULL)
    {
        NULL_detection("set");
        return LPA_FAILURE;
    }
    length_of_a_frag = fragmentArray->fragment_length;
    get_parameters(fragmentArray, index, &i, &j , &index_max_limit);
    low_index_parameter = i * length_of_a_frag;
    high_index_parameter = (i + 1) * length_of_a_frag -1;
    if (index < 0 || index > index_max_limit || index>index_max_limit)
    {
        INVALID_detection(index, i, j, "set");
        return LPA_FAILURE;
    }
    if (fragmentArray->fragments[i] == NULL)
    {
        fragmentArray->fragments[i] = malloc(sys_int * length_of_a_frag);
        if (fragmentArray->fragments[i] == NULL)
        {   return LPA_FAILURE;        }
        fragmentArray->num_active_fragments += 1;
        for (for_loop_INDEX = 0; for_loop_INDEX < length_of_a_frag; for_loop_INDEX++)
        {   fragmentArray->fragments[i][for_loop_INDEX] = UNUSED;                           }
        printf("-> Spawned fragment %d. (capacity: %d, indices: %d..%d)\n",
              i, length_of_a_frag, low_index_parameter, high_index_parameter  );
    }
    if (fragmentArray->fragments[i][j] == UNUSED)
    {
        fragmentArray->size              += 1;
        fragmentArray->fragment_sizes[i] += 1;
    }
    fragmentArray->fragments[i][j] = key;
    return LPA_SUCCESS;
}
int get(FragmentArray *fragmentArray, int index)
{
    int i;
    int j;
    int index_max_limit;
    if (fragmentArray == NULL)
    {
        NULL_detection("get");
        return LPA_FAILURE;
    }
    get_parameters(fragmentArray, index, &i, &j, &index_max_limit);
    if (index < 0 || index > index_max_limit)
    {
        INVALID_detection(index, i, j, "get");
        return LPA_FAILURE;
    }
    if (fragmentArray->fragments[i] == NULL)
    {   return UNUSED;             }
    return fragmentArray->fragments[i][j];
}
int delete(FragmentArray *fragmentArray, int index)
{
    int i;
    int j;
    int index_max_limit;
    int low_index_parameter;
    int high_index_parameter;
    if (fragmentArray == NULL)
    {
        NULL_detection("delete");
        return LPA_FAILURE;
    }
    get_parameters(fragmentArray, index, &i, &j, &index_max_limit);
    low_index_parameter  = i * fragmentArray->fragment_length;
    high_index_parameter = (i + 1 ) * fragmentArray->fragment_length -1;

    if (index < 0 || index > index_max_limit)
    {
        INVALID_detection(index, i, j, "delete");
        return LPA_FAILURE;
    }
    if (fragmentArray->fragments[i] == NULL)
    {   return LPA_FAILURE;        }
    if (fragmentArray->fragments[i][j] != UNUSED)
    {
        fragmentArray->fragments[i][j]    = UNUSED;
        fragmentArray->fragment_sizes[i] -= 1;
        fragmentArray->size              -= 1;
        if (fragmentArray->fragment_sizes[i] == 0)
        {
            free(fragmentArray->fragments[i]);
            fragmentArray->fragments[i]          = NULL;
            fragmentArray->num_active_fragments -= 1;
            printf("-> Deallocated fragment %d. (capacity: %d, indices: %d..%d)\n",
                  i, fragmentArray->fragment_length, low_index_parameter, high_index_parameter);
        }
    }
    else if (fragmentArray->fragments[i][j] == UNUSED)
    {
        return LPA_FAILURE;
    }
    return LPA_SUCCESS;
}
int containsKey(FragmentArray *fragmentArray, int key)
{
    int state_success;
    int for_loop_INDEX;
    int N_fragments;
    if (fragmentArray == NULL)
    {   return 0;    }
    N_fragments   = fragmentArray->num_fragments;
    state_success = 0;
    for (for_loop_INDEX = 0; for_loop_INDEX < N_fragments; for_loop_INDEX++)
    {
        if (fragmentArray->fragment_sizes[for_loop_INDEX] == 0)
        {   continue;                                 }
        else
        {
            state_success = linear_search(fragmentArray, key, for_loop_INDEX);
            if (state_success == 1)
            {   break;            }
        }
    }
    return state_success;
}
int isSet(FragmentArray *fragmentArray, int index)
{
    int i;
    int j;
    int index_max_limit;
    if (fragmentArray == NULL)
    {   return 0;    }
    get_parameters(fragmentArray, index, &i, &j, &index_max_limit);
    if (   index                   > index_max_limit
        || index                   < 0
        || fragmentArray->fragments[i]    == NULL
        || fragmentArray->fragments[i][j] == UNUSED         )
    {   return 0;                                   }
    return 1;
}
int printIfValid(FragmentArray *fragmentArray, int index)
{
    int i;
    int j;
    int index_max_limit;
    if (fragmentArray == NULL       )
    {   return LPA_FAILURE; }
    get_parameters(fragmentArray, index, &i, &j, &index_max_limit);
    if (   index                   > index_max_limit
        || index                   < 0
        || fragmentArray->fragments[i]    == NULL
        || fragmentArray->fragments[i][j] == UNUSED         )
    {   return LPA_FAILURE;                         }
    printf("%d\n", fragmentArray->fragments[i][j]);
    return LPA_SUCCESS;
}
FragmentArray *resetFragmentArray(FragmentArray *fragmentArray)
{
    int for_loop_INDEX;
    int N_fragments;
    int length_of_a_frag;
    if (fragmentArray == NULL)
    {
        NULL_detection("resetFragmentArray");
        return fragmentArray;
    }
    N_fragments      = fragmentArray->num_fragments;
    length_of_a_frag = fragmentArray->fragment_length;
    for (for_loop_INDEX = 0; for_loop_INDEX < N_fragments; for_loop_INDEX++)
    {
        free(fragmentArray->fragments[for_loop_INDEX]);
        fragmentArray->fragments[for_loop_INDEX]      = NULL;
        fragmentArray->fragment_sizes[for_loop_INDEX] = 0;
    }
    fragmentArray->num_active_fragments = 0;
    fragmentArray->size                 = 0;
    printf("-> The FragmentArray has returned to its nascent state. ");
    printf("(capacity: %d, fragments: %d)\n", (N_fragments * length_of_a_frag) , N_fragments );
    return fragmentArray;
}
int getSize(FragmentArray *fragmentArray)
{
    if (fragmentArray == NULL)
    {   return -1;   }
    return fragmentArray->size;
}
int getCapacity(FragmentArray *fragmentArray)
{
    if (fragmentArray == NULL)
    {   return -1;   }
    return (fragmentArray->num_fragments * fragmentArray->fragment_length);
}
int getAllocatedCellCount(FragmentArray *fragmentArray)
{
    if (fragmentArray == NULL)
    {  return -1;    }
    return (fragmentArray->num_active_fragments * fragmentArray->fragment_length);
}
long long unsigned int getArraySizeInBytes(FragmentArray *fragmentArray)
{
    long long unsigned int N_frag_array;
    long long unsigned int Leng_frag_array;
    if (fragmentArray == NULL)
    {   return 0;    }
    N_frag_array    = (long long unsigned int)fragmentArray->num_fragments;
    Leng_frag_array = (long long unsigned int)fragmentArray->fragment_length;
    return sys_int * N_frag_array * Leng_frag_array;
}
long long unsigned int getCurrentSizeInBytes(FragmentArray *fragmentArray)
{
    long long unsigned int Current_Size_Bytes;
    long long unsigned int N_act_frag_LLUI;
    long long unsigned int length_frag_LLUI;
    if (fragmentArray == NULL)
    {   return 0;    }
    N_act_frag_LLUI     = fragmentArray->num_active_fragments;
    length_frag_LLUI    = fragmentArray->fragment_length;
    Current_Size_Bytes  = 0;
    Current_Size_Bytes += sys_p_LPA;
    Current_Size_Bytes += sys_LPA;
    Current_Size_Bytes += (long long unsigned int)sys_p_int * (fragmentArray->num_fragments);
    Current_Size_Bytes += (long long unsigned int)sys_int   * (fragmentArray->num_fragments);
    Current_Size_Bytes += sys_int * N_act_frag_LLUI * length_frag_LLUI;
    return Current_Size_Bytes;
}
double difficultyRating(void)
{   return 3.0;             }
double hoursSpent(void)
{   return 14.0;      }
FragmentArray *cloneFragmentArray(FragmentArray *fragmentArray)
{
    int i;
    int j;
    int num_frags = fragmentArray->num_fragments;
    int leng_frag = fragmentArray->fragment_length;
    int m_mimic   = num_frags * leng_frag;

    FragmentArray *mimic = malloc(sys_LPA);
    if (mimic == NULL)
    {
        free(mimic);
        return NULL;
    }
    mimic->num_fragments        = num_frags;
    mimic->fragment_length      = leng_frag;
    mimic->num_active_fragments = fragmentArray->num_active_fragments;
    mimic->size                 = fragmentArray->size;
    mimic->fragments            = malloc(sys_p_int * num_frags);
    mimic->fragment_sizes       = malloc(sys_int   * num_frags);
    if (mimic->fragments == NULL || mimic->fragment_sizes == NULL)
    {
        free(mimic->fragments);
        free(mimic->fragment_sizes);
        free(mimic);
        return NULL;
    }
    for (i = 0; i < num_frags; i++)
    {
        mimic->fragments[i]      = NULL;
        mimic->fragment_sizes[i] = fragmentArray->fragment_sizes[i];
        if (fragmentArray->fragments[i] != NULL)
        {
          mimic->fragments[i] = malloc(sys_int * leng_frag);
          if (mimic->fragments[i] == NULL)
          {
              free(mimic->fragments);
              free(mimic->fragment_sizes);
              free(mimic);
              return NULL;
          }
          for (j = 0; j < leng_frag; j++)
          {
              if (fragmentArray->fragments[i][j] != UNUSED                  )
              {   mimic->fragments[i][j] = fragmentArray->fragments[i][j];  }
              else
              {   mimic->fragments[i][j] = UNUSED;  }
          }
        }
    }
    printf("-> Successfully cloned the FragmentArray. (capacity: %d, fragments: %d)\n",
          m_mimic, num_frags);
    return mimic;
}