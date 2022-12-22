


#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include "compiler.h"
#define MAX_NUMBER_TOKENS 500
#define MAX_IDENT_LEN 11
#define MAX_NUMBER_LEN 5

lexeme *list;
int lex_index;

void printlexerr(int type);
void printtokens();

// if x null
#define ifn(x) if ((x) == NULL)
// I hate typing NULL - David
#define null NULL
// easier to type and read else if. 
#define eif else if
// Readability def
#define no !
#define equals ==


void printtokens();
void printlexerr(int type);
static int doesStrMatchAtIndex(register char* restrict input, const char* restrict cmp, register int index, register const int cmpLimit);


lexeme *lexanalyzer(char *input)
{
	ifn(input)
		return null;
	ifn(list = calloc(MAX_NUMBER_TOKENS, sizeof(lexeme)))
		return null;
	register int i = 0; // index
	register const int programLength = strlen(input);
	lex_index = 0;
	char stringBuilder[20];
	int tempPos = 0;
	int flagIdenDigit = 0, flagIdenLength = 0;
	int flagNumLen = 0;
	int errorCode = 0;

	// check for 0.
	if(programLength == 0)
		return null;
	for (i = 0; i < programLength; i++)
	{
		// odd
		if ((programLength - i) > 3 && doesStrMatchAtIndex(input, "odd", i, 3) && !isalpha(input[i + 3]) && !isdigit(input[i + 3]))
		{
			list[lex_index].value = 28;
			list[lex_index++].type = oddsym;
			i += 2;
		}
		// begin
		eif ((programLength - i) > 5 && doesStrMatchAtIndex(input, "begin", i, 5) && !isalpha(input[i + 5]) && !isdigit(input[i + 5]))
		{
			list[lex_index].value = 4;
			list[lex_index++].type = beginsym;
			i += 4;
		}
		// end
		eif ((programLength - i) > 3 && doesStrMatchAtIndex(input, "end", i, 3) && !isalpha(input[i + 3]) && !isdigit(input[i + 3]))
		{
			list[lex_index].value = 5;
			list[lex_index++].type = endsym;
			i += 2;
		}
		
		// if
		eif ((programLength - i) > 2 && doesStrMatchAtIndex(input, "if", i, 2) && !isalpha(input[i + 2]) && !isdigit(input[i + 2]))
		{
			list[lex_index].value = 8;
			list[lex_index++].type = ifsym;
			i += 1;
		}
		// then
		eif ((programLength - i) > 4 && doesStrMatchAtIndex(input, "then", i, 4) && !isalpha(input[i + 4]) && !isdigit(input[i + 4]))
		{
			list[lex_index].value = 9;
			list[lex_index++].type = thensym;
			i += 3;
		}
		// while
		eif ((programLength - i) > 5 && doesStrMatchAtIndex(input, "while", i, 5) && !isalpha(input[i + 5]) && !isdigit(input[i + 5]))
		{
			list[lex_index].value = 6;
			list[lex_index++].type = whilesym;
			i += 4;
		}
		// do
		eif ((programLength - i) > 2 && doesStrMatchAtIndex(input, "do", i, 2) && !isalpha(input[i + 2]) && !isdigit(input[i + 2]))
		{
			i = i + 1;
			list[lex_index].value = 7;
			list[lex_index++].type = dosym;

		}
		// call
		eif  ((programLength - i) > 4 && doesStrMatchAtIndex(input, "call", i, 4) && !isalpha(input[i + 4]) && !isdigit(input[i + 4]))
		{
			i = i + 3;
			list[lex_index].value = 11;
			list[lex_index++].type = callsym;
		}
		// const
		eif((programLength - i) >= 5 && doesStrMatchAtIndex(input, "const", i, 5) && !isalpha(input[i + 5]) && !isdigit(input[i + 5]))
		{
			i += 4;
			list[lex_index].value = 1;
			list[lex_index++].type = constsym;
		}
		// var
		eif ((programLength - i) > 3 && doesStrMatchAtIndex(input, "var", i, 3) && !isalpha(input[i + 3]) && !isdigit(input[i + 3]))
		{
			i += 2;

			list[lex_index].value = 2;
			list[lex_index++].type = varsym;
		}
		// procedure
		eif ((programLength - i) > 9 && doesStrMatchAtIndex(input, "procedure", i, 9) && !isalpha(input[i + 9]) && !isdigit(input[i + 9]))
		{

			i += 8;
			list[lex_index].value = 3;
			list[lex_index++].type = procsym;
		}
		// write
		eif ((programLength - i) > 5 && doesStrMatchAtIndex(input, "write", i, 5) && !isalpha(input[i + 5]) && !isdigit(input[i + 5]))
		{
			i += 4;
			list[lex_index].value = 12;
			list[lex_index++].type = writesym;
		}
		// read
		eif ((programLength - i) > 4 && doesStrMatchAtIndex(input, "read", i, 4) && !isalpha(input[i + 4]) && !isdigit(input[i + 4]))
		{
			i += 3;
			list[lex_index].value = 13;

			list[lex_index++].type = readsym;
		}
		// else
		eif ((programLength - i) > 4 && doesStrMatchAtIndex(input, "else", i, 4) && !isalpha(input[i + 4]) && !isdigit(input[i + 4]))
		{
			i += 3;
			list[lex_index].value = 10;
			list[lex_index++].type = elsesym;
		}
		// comment
		eif ((programLength - i) > 2 && doesStrMatchAtIndex(input, "//", i, 2))
		{
			for (i += 2; 1 == 1; i++)
			{
				if (input[i] == '\n')
				{
					break;
				}
			}
		}
		// Below, multiple logical operators are checked.
		eif (doesStrMatchAtIndex(input, "<=", i, 2))
		{
			i += 1;
			list[lex_index].value = 25;
			list[lex_index++].type = leqsym;
		}
		eif (doesStrMatchAtIndex(input, ">=", i, 2))
		{
			i += 1;
			list[lex_index].value = 27;
			list[lex_index++].type = geqsym;
		}
		eif (doesStrMatchAtIndex(input, "==", i, 2))
		{
			i = i + 1;
			list[lex_index++].type = eqlsym;
		}
		eif ((programLength - i) > 2 && doesStrMatchAtIndex(input, ":=", i, 2))
		{
			i += 1;
			list[lex_index].value = 16;
			list[lex_index++].type = assignsym;
		}
		eif (input[i] == '%')
		{
			list[lex_index].value = 21;
			list[lex_index++].type = modsym;
		}
		eif (input[i] == '+')
		{
			list[lex_index].value = 17;
			list[lex_index++].type = addsym;
		}
		eif (input[i] == '-')
		{
			list[lex_index].value = 18;
			list[lex_index++].type = subsym;
		}
		eif (input[i] == '*')
		{
			list[lex_index].value = 19;
			list[lex_index++].type = multsym;
		}
		eif (input[i] == '/')
		{
			list[lex_index].value = 20;
			list[lex_index++].type = divsym;
		}
		eif (input[i] == '<')
		{
			list[lex_index].value = 24;
			list[lex_index++].type = lsssym;
		}
		eif (input[i] == '>')
		{
			list[lex_index].value = 26;
			list[lex_index++].type = gtrsym;
		}
		// Paranthesis checked
		eif (input[i] == '(')
		{
			list[lex_index].value = 29;
			list[lex_index++].type = lparensym;
		}
		eif (input[i] == ')')
		{
			list[lex_index].value = 30;
			list[lex_index++].type = rparensym;
		}
		// linguistic control characters
		eif (input[i] == ',')
		{
			list[lex_index].value = 31;
			list[lex_index++].type = commasym;
		}
		eif (input[i] == '.')
		{
			list[lex_index].value = 32;
			list[lex_index++].type = periodsym;
		}
		eif (input[i] == ';')
		{
			list[lex_index].value = 33;
			list[lex_index++].type = semicolonsym;
		}
		// identifier
		eif(isalpha(input[i]))
		{
			while (isalpha(input[i]) || isdigit(input[i]))
			{
				if (flagIdenLength < MAX_IDENT_LEN)
				{
					stringBuilder[tempPos] = input[i];
					tempPos++;
				}
				flagIdenLength++;
				i++;
			}
			if (flagIdenLength > MAX_IDENT_LEN)
			{
				errorCode = 4;
				break;
			}
			else
			{
				stringBuilder[tempPos] = '\0';
				// Update tokenList
				list[lex_index].value = 14;
				strcpy(list[lex_index].name, stringBuilder);

				list[lex_index++].type = identsym;
			}
			// Reset flags
			tempPos = 0;
			flagIdenLength = 0;
			i--;
		}
		// number
		eif (isdigit(input[i]))
		{
			while (isdigit(input[i]) || isalpha(input[i]))
			{
				if (isalpha(input[i]))
				{
					flagIdenDigit = 1;
				}

				if (flagIdenDigit == 0 && flagNumLen < 5)
				{
					stringBuilder[tempPos] = input[i];
					tempPos++;
				}
				if (flagIdenDigit == 0)
				{
					flagNumLen++;
				}
				i++;
			}
			if (flagNumLen > MAX_NUMBER_LEN)
			{
				errorCode = 3;
				break;
			}
			eif(flagIdenDigit >= 1)
			{

				errorCode = 2;
				break;
			}
			else
			{
				stringBuilder[tempPos] = '\0';
				// Update tokenList
				list[lex_index].value = atoi(stringBuilder);
				strcpy(list[lex_index].name, stringBuilder);

				list[lex_index++].type = numbersym;
			}
			// Reset flags
			tempPos = 0;
			flagIdenDigit = 0;
			flagNumLen = 0;
			i--;
		}
		// space
		eif(!isspace(input[i]))
		{
			errorCode = 1;
			break;
		}
	}
	if (no errorCode)
	{
		printtokens();
	}
	else
	{
		printlexerr(errorCode);
		return null;
	}

	

	return list;
}

// Token printer.
void printtokens()
{
	int i;
	printf("Lexeme Table:\n");
	printf("lexeme\t\ttoken type\n");
	for (i = 0; i < lex_index; i++)
	{
		switch (list[i].type)
		{
			case oddsym:
				printf("%11s\t%d", "odd", oddsym);
				break;
			case eqlsym:
				printf("%11s\t%d", "==", eqlsym);
				break;
			case neqsym:
				printf("%11s\t%d", "!=", neqsym);
				break;
			case lsssym:
				printf("%11s\t%d", "<", lsssym);
				break;
			case leqsym:
				printf("%11s\t%d", "<=", leqsym);
				break;
			case gtrsym:
				printf("%11s\t%d", ">", gtrsym);
				break;
			case geqsym:
				printf("%11s\t%d", ">=", geqsym);
				break;
			case modsym:
				printf("%11s\t%d", "%", modsym);
				break;
			case multsym:
				printf("%11s\t%d", "*", multsym);
				break;
			case divsym:
				printf("%11s\t%d", "/", divsym);
				break;
			case addsym:
				printf("%11s\t%d", "+", addsym);
				break;
			case subsym:
				printf("%11s\t%d", "-", subsym);
				break;
			case lparensym:
				printf("%11s\t%d", "(", lparensym);
				break;
			case rparensym:
				printf("%11s\t%d", ")", rparensym);
				break;
			case commasym:
				printf("%11s\t%d", ",", commasym);
				break;
			case periodsym:
				printf("%11s\t%d", ".", periodsym);
				break;
			case semicolonsym:
				printf("%11s\t%d", ";", semicolonsym);
				break;
			case assignsym:
				printf("%11s\t%d", ":=", assignsym);
				break;
			case beginsym:
				printf("%11s\t%d", "begin", beginsym);
				break;
			case endsym:
				printf("%11s\t%d", "end", endsym);
				break;
			case ifsym:
				printf("%11s\t%d", "if", ifsym);
				break;
			case thensym:
				printf("%11s\t%d", "then", thensym);
				break;
			case elsesym:
				printf("%11s\t%d", "else", elsesym);
				break;
			case whilesym:
				printf("%11s\t%d", "while", whilesym);
				break;
			case dosym:
				printf("%11s\t%d", "do", dosym);
				break;
			case callsym:
				printf("%11s\t%d", "call", callsym);
				break;
			case writesym:
				printf("%11s\t%d", "write", writesym);
				break;
			case readsym:
				printf("%11s\t%d", "read", readsym);
				break;
			case constsym:
				printf("%11s\t%d", "const", constsym);
				break;
			case varsym:
				printf("%11s\t%d", "var", varsym);
				break;
			case procsym:
				printf("%11s\t%d", "procedure", procsym);
				break;
			case identsym:
				printf("%11s\t%d", list[i].name, identsym);
				break;
			case numbersym:
				printf("%11d\t%d", list[i].value, numbersym);
				break;
			default:
				continue;
		}
		printf("\n");
	}
	printf("\n");
	printf("Token List:\n");
	for (i = 0; i < lex_index; i++)
	{
		list[i];
		if (list[i].type == numbersym)
			printf("%d %d ", numbersym, list[i].value);
		else if (list[i].type == identsym)
			printf("%d %s ", identsym, list[i].name);
		else
			printf("%d ", list[i].type);
	}
	printf("\n");
	list[lex_index++].type = -1;
}
// Prints errors based on error code.
void printlexerr(int type)
{
	if (type == 1)
		printf("Lexical Analyzer Error: Invalid Symbol\n");
	else if (type == 2)
		printf("Lexical Analyzer Error: Invalid Identifier\n");
	else if (type == 3)
		printf("Lexical Analyzer Error: Excessive Number Length\n");
	else if (type == 4)
		printf("Lexical Analyzer Error: Excessive Identifier Length\n");
	else
		printf("Implementation Error: Unrecognized Error Type\n");
	
	free(list);
	return;
}

// Helper function to help simplify syntax parsing because students pay tuition use C at a CS college in 2021 instead of a modern language.
static int doesStrMatchAtIndex(register char* restrict input, const char* restrict cmp, register int index, register const int cmpLimit)
{
	register int cmpIndex = 0;
	for (cmpIndex; cmpIndex < cmpLimit; cmpIndex++)
	{
		if (input[index] == cmp[cmpIndex])
		{
			index++;
			continue;
		}
		else
			return 0;
	}
	return 1;
};