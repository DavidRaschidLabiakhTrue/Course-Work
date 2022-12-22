

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <string.h>
#include "UnlistedClassHeaderDueToLegalReasons.h"


#define D_malloc_Node malloc(sizeof(Node))
#define D_calloc_Node calloc(1, sizeof(Node))
#define D_malloc_LI	  malloc(sizeof(FibonacciListSequence))
#define D_calloc_LI	  calloc(1, sizeof(FibonacciListSequence))

#define D_compare(ARG)    ((--ARG) != 1)

#define D_one_check(ARG)  (ARG == 1)

#define D_rapid_add_3(x, y, z) (x = x + y + z)

#define D_rapid_add_2(x, y, z) ( x = y + z)

FibonacciListSequence 	 *listyAdd(FibonacciListSequence *p, FibonacciListSequence *q);
FibonacciListSequence 	 *destroyFibonacciListSequence(FibonacciListSequence *listy);
FibonacciListSequence 	 *stringToFibonacciListSequence(char *str);
char 	 	 *FibonacciListSequenceToString(FibonacciListSequence *listy);
FibonacciListSequence 	 *uintToFibonacciListSequence(unsigned int n);
unsigned int *FibonacciListSequenceToUint(FibonacciListSequence *listy);
void 	 	 plusPlus(FibonacciListSequence *listy);
FibonacciListSequence 	 *fib(unsigned int n);
FibonacciListSequence 	 *cloneLI(FibonacciListSequence *PARENT_LI);
FibonacciListSequence  	 *MAKE_0_LI(void);


FibonacciListSequence *fib(unsigned int n)
{
		FibonacciListSequence *a=NULL;
		FibonacciListSequence *b=NULL;

		register FibonacciListSequence *temp  = NULL;
		register Node *LOC_a     = NULL;
		register Node *LOC_b     = NULL;
		register int length_cmp;
		register int count;
		register int add;

		if (n == 0)
		{		return MAKE_0_LI();		}

		if ((a       = D_calloc_LI)	  == NULL |
			(b       = D_calloc_LI)	  == NULL |
			(a->head = D_calloc_Node) == NULL |
			(b->head = D_calloc_Node) == NULL )
		{
				destroyFibonacciListSequence(a);
				destroyFibonacciListSequence(b);
				return NULL;
		}

		++a->head->digit;
		++b->head->digit;
		++a->length;
		++b->length;
		if (n < 3)
		{
				destroyFibonacciListSequence(a);
				return b;
		}
		while (D_compare(n))
		{
				
				LOC_a 	   = a->head;
				LOC_b 	   = b->head;

				D_rapid_add_2(count, a->length, 1);
				D_rapid_add_2(length_cmp, a->length, 1);
				add        = 0;
				a->length  = b->length;

				while (--count)
				{
						
						if (D_rapid_add_3(LOC_a->digit, LOC_b->digit, add) < 10)
						{		add = 0;		}
						else
						{
								add = 1;
								LOC_a->digit -=10;
						}

						if (D_one_check(count))
						{
							 	LOC_a->next = NULL;
							 	break;
						}
						
						LOC_a = LOC_a->next;
						LOC_b = LOC_b->next;
				}

				if ((count = 1 + a->length - length_cmp) != 0)
				{
						
						++count;

						if ((LOC_a->next = D_malloc_Node) == NULL)
						{
								destroyFibonacciListSequence(a);
								destroyFibonacciListSequence(b);
								return NULL;
						}
						LOC_a = LOC_a->next;
						LOC_b = LOC_b->next;
						while (--count)
						{
								if (D_rapid_add_2(LOC_a->digit, LOC_b->digit, add) < 10 )
								{		add = 0;		}
								else
								{
										add = 1;
										LOC_a->digit -=10;
								}
								if (D_one_check(count))
								{
										LOC_a->next = NULL;
										break;
								}
								if ((LOC_a->next = D_malloc_Node) == NULL)
								{
										destroyFibonacciListSequence(a);
										destroyFibonacciListSequence(b);
										return NULL;
								}
								LOC_a = LOC_a->next;
								LOC_b = LOC_b->next;
						}
				}

				if (add)
				{
						if ((LOC_a->next = D_calloc_Node) == NULL)
						{
								destroyFibonacciListSequence(a);
								destroyFibonacciListSequence(b);
								return NULL;
						}
						LOC_a = LOC_a->next;
						++LOC_a->digit;
						++a->length;
				}
				temp = b;
				b = a;
				a = temp;
		}
		destroyFibonacciListSequence(a);
		return b;
}

FibonacciListSequence *listyAdd(FibonacciListSequence *p, FibonacciListSequence *q)
{
		FibonacciListSequence *temp_LI        	= NULL;
		register FibonacciListSequence *CLONE_P	= NULL;
		register FibonacciListSequence *CLONE_Q  = NULL;
		register Node *max_REF	 	= NULL;
		register Node *LOCAL_P   	= NULL;
		register Node *LOCAL_Q   	= NULL;
		register Node *BUILD_LI  	= NULL;

		register int LOC_P_leng;
		register int LOC_Q_leng;
		register int temp_HOLD = 0;

		if ((temp_LI       = D_malloc_LI)   == NULL |
			(temp_LI->head = D_malloc_Node) == NULL |
			p                               == NULL |
			q                               == NULL |
			(CLONE_P = cloneLI(p))          == NULL |
			(CLONE_Q = cloneLI(q))			== NULL  )
		{
				destroyFibonacciListSequence(CLONE_P);
				destroyFibonacciListSequence(CLONE_Q);
				destroyFibonacciListSequence(temp_LI);
				return NULL;
		}
		LOC_P_leng = CLONE_P->length;
		LOC_Q_leng = CLONE_Q->length;
		LOCAL_P    = CLONE_P->head;
		LOCAL_Q    = CLONE_Q->head;
		BUILD_LI   = temp_LI->head;

		if (LOC_P_leng >= LOC_Q_leng)
		{
				temp_LI->length = LOC_P_leng;
				max_REF         = LOCAL_Q;
		}
		else
		{
				temp_LI->length = LOC_Q_leng;
				max_REF  		= LOCAL_P;
		}
		while (max_REF != NULL)
		{
				temp_HOLD = LOCAL_P->digit + LOCAL_Q->digit + temp_HOLD;
				BUILD_LI->digit = (temp_HOLD) % 10;
				temp_HOLD = (temp_HOLD) / 10;
				if ((max_REF = max_REF-> next) != NULL)
				{
						if ((BUILD_LI->next = D_malloc_Node) == NULL)
						{
								destroyFibonacciListSequence(temp_LI);
									return NULL;
						}
						BUILD_LI = BUILD_LI->next;
						LOCAL_P  = LOCAL_P->next;
						LOCAL_Q  = LOCAL_Q->next;
						continue;
				}
				else
				{		BUILD_LI->next = NULL;		}
		}
		max_REF = (LOC_P_leng >= LOC_Q_leng) ? LOCAL_P->next: LOCAL_Q->next;
		if (max_REF != NULL)
		{
				if ((BUILD_LI->next = D_malloc_Node) == NULL)
				{
						destroyFibonacciListSequence(temp_LI);
						return NULL;
				}
				BUILD_LI = BUILD_LI->next;
				while (max_REF != NULL)
				{
						temp_HOLD 		= (max_REF->digit + temp_HOLD);
						BUILD_LI->digit = (temp_HOLD) % 10;
						temp_HOLD 		= (temp_HOLD) / 10;
						if ((max_REF = max_REF-> next) != NULL)
						{
								if ((BUILD_LI->next = D_malloc_Node) == NULL)
								{
										destroyFibonacciListSequence(temp_LI);
										return NULL;
								}
								BUILD_LI = BUILD_LI->next;
								continue;
						}
						else
						{		BUILD_LI->next = NULL;		}
				}
		}

		if (temp_HOLD)
		{
				if ((BUILD_LI->next = D_calloc_Node) == NULL)
				{
						destroyFibonacciListSequence(temp_LI);
						return NULL;
				}

				BUILD_LI = BUILD_LI->next;
				++BUILD_LI->digit;
				++temp_LI->length;
		}
		// They never even had a chance.
		destroyFibonacciListSequence(CLONE_P);
		destroyFibonacciListSequence(CLONE_Q);
		return temp_LI;
}

FibonacciListSequence *destroyFibonacciListSequence(FibonacciListSequence *listy)
{

		register Node   *DESTROY_LI  	    = NULL;
		register Node   *CONTROL_LI_DESTROY = NULL;
		if (listy == NULL )
		{	return NULL;		}

		CONTROL_LI_DESTROY         = listy->head;
		while (CONTROL_LI_DESTROY != NULL)
		{
				DESTROY_LI         = CONTROL_LI_DESTROY;
				CONTROL_LI_DESTROY = CONTROL_LI_DESTROY->next;
				free(DESTROY_LI);
		}
		free(listy);
		return NULL;
}
FibonacciListSequence *stringToFibonacciListSequence(char *str)
{
		FibonacciListSequence *temp_LI = NULL;
		Node *BUILD_LI    = NULL;
		int STRING_leng;
		if ( str                                   != NULL &&
			(temp_LI = malloc(sizeof(FibonacciListSequence)))   != NULL &&
			(temp_LI->head = malloc(sizeof(Node))) != NULL   )
		{
				BUILD_LI 		= temp_LI->head;
				temp_LI->length	= 0;
				STRING_leng 	= strlen(str);
				STRING_leng 	= STRING_leng - 1;
		}
		else
		{
				destroyFibonacciListSequence(temp_LI);
				return NULL;
		}
		if (str[0] == '\0' || str[0] == '0')
		{
				temp_LI->length = 1;
				BUILD_LI->digit = 0;
				BUILD_LI->next  = NULL;
				return temp_LI;
		}

		for (STRING_leng; STRING_leng >= 0; STRING_leng--)
		{
				BUILD_LI->digit = str[STRING_leng] - '0';
				++temp_LI->length;
				if (STRING_leng != 0)
				{
						if ((BUILD_LI->next = D_calloc_Node) != NULL)
						{		BUILD_LI = BUILD_LI->next;					}
						else
						{		destroyFibonacciListSequence(temp_LI);					}
				}
				else
				{		BUILD_LI->next = NULL;								}
		}
		return temp_LI;
}

char *FibonacciListSequenceToString(FibonacciListSequence *listy)
{
		char 		  *temp_STRING	   = NULL;
		register int   STRING_leng;
		register Node *BUILD_LI_STRING = NULL;
		if (listy                                                 != NULL &&
		   (temp_STRING = calloc(listy->length +1, sizeof(char))) != NULL    )
		{
				STRING_leng 	= listy->length - 1;
				BUILD_LI_STRING = listy->head;
		}
		else
		{
				free (temp_STRING);
				return NULL;
		}
		for (STRING_leng; STRING_leng >= 0; STRING_leng--)
		{

				temp_STRING[STRING_leng] = BUILD_LI_STRING->digit + '0';
				if (STRING_leng != 0)
				{		BUILD_LI_STRING = BUILD_LI_STRING->next;		}
		}

		temp_STRING[listy->length + 1] = '\0';
		return temp_STRING;
}

FibonacciListSequence *uintToFibonacciListSequence(unsigned int n)
{
		FibonacciListSequence *temp_LI               = NULL;
		register Node *BUILD_LI         = NULL;
		register Node *CONTROL_LI_BUILD = NULL;
		register int UNSIGNED_leng      = 0;
		if (n == 0)
		{
				temp_LI = MAKE_0_LI();
				return temp_LI;
		}

		if ((temp_LI       = D_calloc_LI)	== NULL |
			(temp_LI->head = D_malloc_Node) == NULL  )
		{
				destroyFibonacciListSequence(temp_LI);
				return NULL;
		}
		BUILD_LI       = temp_LI->head;
		BUILD_LI->next = NULL;
		while (n != 0)
		{
			++temp_LI->length;
			BUILD_LI->digit = (int)(n % 10);
			if ((n = n / 10) != 0)
			{
				if ((BUILD_LI->next = D_malloc_Node) != NULL)
				{		BUILD_LI = BUILD_LI->next;			}
				else
				{
						destroyFibonacciListSequence(temp_LI);
						return NULL;
				}
			}
			else
			{
					BUILD_LI->next = NULL;
					break;
			}
		}
		return temp_LI;
}

unsigned int *FibonacciListSequenceToUint(FibonacciListSequence *listy)
{
		long unsigned int compare =  0;
		unsigned int *uPTR        = NULL;
		unsigned int value_return;
		register Node *BUILD_LI   =NULL;
		register int INDEX;
		register int Listy_leng;

		static long unsigned int O_1_POWER_TABLE[10] =
		{1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000};
		if (listy == NULL | (uPTR = malloc(sizeof(unsigned int))) == NULL)
		{
				free (uPTR);
				return NULL;
		}
		Listy_leng = listy->length;

		if (Listy_leng > 10 )
		{
				free (uPTR);
				return NULL;
		}
		BUILD_LI = listy->head;

		for (INDEX = Listy_leng; INDEX >= 1; INDEX--)
		{
				// breakdown based access
				compare += O_1_POWER_TABLE[Listy_leng - INDEX] * BUILD_LI->digit;
				if ((BUILD_LI = BUILD_LI->next) == NULL)
				{		break;						   }
		}
		if (compare > UINT_MAX)
		{
				free (uPTR);
				return NULL;
		}

		value_return = (unsigned int)compare;
		*uPTR        = value_return;
		return uPTR;
}

void plusPlus(FibonacciListSequence *listy)
{
		FibonacciListSequence 	  *temp_LI            = NULL;
		Node 		  *CONTROL_LI_BUILD   = NULL;
		register Node *DESTROY_LI  	      = NULL;
		register Node *CONTROL_LI_DESTROY = NULL;
		int add                           = 0;
		int length;
		if (listy == NULL)
		{		return;  }
		if ((temp_LI = cloneLI(listy)) == NULL)
		{		return;						  }
		CONTROL_LI_BUILD = temp_LI->head;
		if ( ++CONTROL_LI_BUILD->digit > 9)
		{
				CONTROL_LI_BUILD->digit -= 10;
				add = 1;
				length = temp_LI->length - 1;
				if (length != 0)
				{		CONTROL_LI_BUILD = CONTROL_LI_BUILD->next;		}
				for (length; length != 0; length--)
				{
								if (++CONTROL_LI_BUILD->digit > 9)
								{
										CONTROL_LI_BUILD->digit -= 10;
										add = 1;
										if (CONTROL_LI_BUILD->next != NULL)
										{		CONTROL_LI_BUILD = CONTROL_LI_BUILD->next;		}
										else
										{		break;											}
								}
								else
								{
										add = 0;
										break;
								}
				}
				if (add)
				{
						if ((CONTROL_LI_BUILD->next = D_calloc_Node ) == NULL)
						{
								destroyFibonacciListSequence(temp_LI);
								return;
						}
						CONTROL_LI_BUILD = CONTROL_LI_BUILD->next;
						++CONTROL_LI_BUILD->digit;
						++temp_LI->length;
				}
		}

		CONTROL_LI_DESTROY         = listy->head;
		while (CONTROL_LI_DESTROY != NULL)
		{
				DESTROY_LI         = CONTROL_LI_DESTROY;
				CONTROL_LI_DESTROY = CONTROL_LI_DESTROY->next;
				free(DESTROY_LI);
		}
		listy->head   =  temp_LI->head;
		listy->length = temp_LI ->length;
		return;

}

FibonacciListSequence *MAKE_0_LI(void)
{
		FibonacciListSequence *temp_LI = NULL;
		if((temp_LI = D_calloc_LI)         == NULL|
		   (temp_LI->head = D_calloc_Node) == NULL)
		{
			destroyFibonacciListSequence(temp_LI);
			return NULL;
		}
		++temp_LI->length;
		return temp_LI;
}

FibonacciListSequence *cloneLI(FibonacciListSequence *PARENT_LI)
{
		FibonacciListSequence      *temp_LI = NULL;
		register Node *copy    = NULL;
		register Node *copied  = NULL;
		if ((temp_LI       = D_calloc_LI  ) == NULL |
			(temp_LI->head = D_calloc_Node) == NULL|
			 PARENT_LI                      == NULL  )
		{
				destroyFibonacciListSequence(temp_LI);
				return NULL;
		}
		temp_LI->length = PARENT_LI->length;
		copy   			= PARENT_LI->head;
		copied 			= temp_LI->head;
		while (copy != NULL)
		{
				copied->digit = copy->digit;
				if ((copy = copy->next) != NULL)
				{
					if ((copied->next = D_calloc_Node) != NULL)
					{		copied = copied->next;			  }
					else
					{
						destroyFibonacciListSequence(temp_LI);
						return NULL;
					}
				}
		}
		return temp_LI;
}

