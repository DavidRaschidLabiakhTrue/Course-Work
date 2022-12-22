
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "compiler.h"

#define MAX_CODE_LENGTH 1000
#define MAX_SYMBOL_COUNT 100

instruction *code;
int cIndex = 0;
symbol *table;
int tIndex = 0;
int tokenaccess = 0;
int level = 0;


int symidx = 0;
int symIdx_const = 0;
int symIdx_var  = 0;
int jpcidx = 0;
int jmpidx = 0;


lexeme token;
lexeme* tokens;

enum VAL_opCode { LIT = 1, OPR = 2, LOD = 3, STO = 4, CAL = 5, INC = 6, JMP = 7, JPC = 8, SYS = 9};

enum sys_Codes { WRT = 1, RED = 2, HAL = 3 };
enum VAL_mCode { RTN = 0, NEG = 1, ADD = 2, SUB = 3, MUL = 4, DIV = 5, ODD = 6, MOD = 7, EQL = 8, NEQ = 9, LSS = 10, LEQ = 11, GTR = 12, GEQ = 13 };
enum errs {
	errPeriod = 1, errConstDeclare, errVarDeclare, errProcedureDeclare,
	errAssign, errAssignRead, errCallProcedurem, errIfThen, errWhileDo,
	errRelationMissing, errArithmetic, errFollowBy, errMultiSymbolSeperation,
	errSymbolSemicolon, errBeginEndSemiColon, errBeginEnd,
	errBadArithmeticLogic, errConflictSymbols, errUndeclared
};
enum alterr { errsym = -666 };

// macros for reading
#define marked 1
#define unmarked 0

// Macros for speeding up work
// if token type is, if token type is not
#define iftt(x) if (token.type == (x))
#define ifttn(x) if (token.type != (x))

// requested funcs
void program();
void block();
void constdeclare();
int vardeclare();
void procdeclare();
void statement();
void condition();
void expression();
void term();
void factor();
void mark();

// requested additional funcs without pseudo code.
lexeme gettoken();
int multipledeclarationcheck(lexeme input);
int findsymbol(lexeme input, int kind);

// given funcs
void emit(int opname, int level, int mvalue);
void addToSymbolTable(int k, char n[], int v, int l, int a, int m);
void printparseerror(int err_code);
void printsymboltable();
void printassemblycode();


int db_program = 0;

instruction *parse(lexeme *list, int printTable, int printCode)
{
	code = NULL;
	code = calloc(MAX_CODE_LENGTH, sizeof(instruction)); // 0 out allocation
	table = calloc(MAX_SYMBOL_COUNT, sizeof(symbol)); // 0 out allocation
	tokens = list; // makes global

	program();

	if (printTable)
		printsymboltable();
	if (printCode)
		printassemblycode();
	if (table != NULL)
		free(table);

	/* this line is EXTREMELY IMPORTANT, you MUST uncomment it
	when you test your code otherwise IT WILL SEGFAULT in
	vm.o THIS LINE IS HOW THE VM KNOWS WHERE THE CODE ENDS
	WHEN COPYING IT TO THE PAS
	*/
	code[cIndex].opcode = -1;
	return code;
}

void program()
{

	
	emit(JMP, 0, 9);
	addToSymbolTable(3, "main", 0, 0, 0, unmarked);
	level = -1;
	gettoken();
	block();
	ifttn(periodsym)
	{
		printparseerror(errPeriod);
	}
	emit(9, 0, 3); // HALT
	// Including the pseudo code with checking line by line breaking everything.
	// Not doing that.
	code[0].m = table[0].addr;
	return;
}
// scopes out a block of code.
void block()
{
	++level;
	int procidx = tIndex - 1;
	constdeclare();
	int x = vardeclare();
	procdeclare();
	table[procidx].addr = cIndex * 3;
	if (level == 0)
		emit(INC, 0, x);
	else
		emit(INC, 0, x + 3);
	statement();
	mark();
	--level;
	return;
}
// processes a constant declare
void constdeclare()
{
	// temps due to recursion
	char tempbuffer[12];
	int tempval;
	iftt(constsym)
	{
		do
		{
			gettoken();
			ifttn(identsym)
			{
				printparseerror(errConstDeclare);
			}
			symidx = multipledeclarationcheck(token);
			if (symidx != -1)
				printparseerror(errConflictSymbols);
			strcpy(tempbuffer, token.name);
			
			gettoken();
			ifttn(assignsym)
				printparseerror(errAssign);
			gettoken();
			ifttn(numbersym)
				printparseerror(errConstDeclare);
			addToSymbolTable(1, tempbuffer, token.value, level, 0, unmarked); // SCUFF
			gettoken();
		} while (token.type == commasym);
		gettoken();
	}


	return;
}
// processes a variable declare
int vardeclare()
{
	int numVars = 0;

	iftt(varsym)
	{
		do
		{
			numVars++;
			gettoken();
			ifttn(identsym)
				printparseerror(errVarDeclare);
			symidx = multipledeclarationcheck(token);
			if (symidx != -1)
				printparseerror(errConflictSymbols);
			if (level == 0)
				addToSymbolTable(2, token.name, 0, level, numVars - 1, unmarked);
			else
				addToSymbolTable(2, token.name, 0, level, numVars + 2, unmarked);
			gettoken();
		} while (token.type == commasym);
		ifttn(semicolonsym)
		{
			iftt(identsym)
				printparseerror(errMultiSymbolSeperation);
			else
				printparseerror(errSymbolSemicolon);
		}
		gettoken();
	}
	return numVars;
}
// processes a procedure declare
void procdeclare()
{
	while (token.type == procsym)
	{
		gettoken();
		ifttn(identsym)
			printparseerror(errProcedureDeclare);
		symidx = multipledeclarationcheck(token);
		if (symidx != -1)
			printparseerror(errConflictSymbols);
		addToSymbolTable(3, token.name, 0, level, 0, unmarked);
		gettoken();
		ifttn(semicolonsym)
			printparseerror(errProcedureDeclare);
		gettoken();

		block();
		ifttn(semicolonsym)
			printparseerror(errSymbolSemicolon);
		gettoken();

		emit(OPR, 0, RTN); // RTN
	}
	return;
}
// processes a statement
void statement()
{
	iftt(identsym)
	{
		symidx = findsymbol(token, 2);
		if (symidx == -1)
		{
			if (findsymbol(token, 1) != findsymbol(token, 3))
				printparseerror(errAssignRead);
			else
				printparseerror(errConflictSymbols);
		}
		gettoken();
		ifttn(assignsym)
			printparseerror(errAssign);
		gettoken();
		expression();
		emit(STO, level - table[symidx].level, table[symidx].addr);
		return;
	}
	iftt(beginsym)
	{
		do
		{
			gettoken();
			statement();
		} while (token.type == semicolonsym);
		ifttn(endsym)
		{
			if (token.type == identsym || token.type == beginsym || token.type == ifsym || token.type == whilesym || token.type == readsym || token.type == writesym || token.type == callsym)
			{
				printparseerror(errBeginEndSemiColon);
			}
			else
				printparseerror(errBeginEnd);

		}
		gettoken();
		return;
	}
	iftt(ifsym)
	{
		gettoken();
		condition();
		jpcidx = cIndex;
		emit(JPC, 0, 0); // suspect
		ifttn(thensym)
			printparseerror(errIfThen);
		gettoken();
		statement();
		iftt(elsesym)
		{
			gettoken();
			jmpidx = cIndex;
			emit(JMP, 0, cIndex);
			code[jpcidx].m = cIndex * 3;
			
			statement();
			code[jmpidx].m = cIndex * 3;
		}
		else
			code[jpcidx].m = cIndex * 3;
		return;
	}
	iftt(whilesym)
	{
		gettoken();
		int loopidx = cIndex;
		condition();
		ifttn(dosym)
		{
			printparseerror(errWhileDo);
		}
		gettoken();
		int tempjpcidx = cIndex;
		emit(JPC, 0, 0);
		statement();
		emit(JMP, 0, loopidx * 3);
		code[tempjpcidx].m = cIndex * 3;
		return;
	}
	iftt(readsym)
	{
		gettoken();
		ifttn(identsym)
		{
			printparseerror(errAssignRead);
		}
		symidx = findsymbol(token, 2);
		if (symidx == -1)
		{
			if (findsymbol(token, 1) != findsymbol(token, 3))
				printparseerror(errUndeclared);
			else
				printparseerror(errConflictSymbols);
		}
		gettoken();
		emit(SYS, 0, RED);
		emit(STO, level - table[symidx].level, table[symidx].addr);
		return;
	}
	iftt(writesym)
	{
		gettoken();
		expression();
		emit(SYS, 0, 1); //write
		return;
	}
	iftt(callsym)
	{
		gettoken();
		symidx = findsymbol(token, 3);
		if (symidx == -1)
		{
			if (findsymbol(token, 1) != findsymbol(token, 2))
				printparseerror(errCallProcedurem);
			else
				printparseerror(errConflictSymbols);
		}

		gettoken();
		emit(CAL, level - table[symidx].level, table[symidx].addr);
	}
	return;
}
// processes a condition
void condition()
{
	iftt(oddsym)
	{
		gettoken();
		expression();
		emit(OPR,0,ODD);
	}
	else
	{
		expression();
		iftt(eqlsym)
		{
			gettoken();
			expression();
			emit(OPR, 0, EQL);
		}
		else iftt(neqsym)
		{
			gettoken();
			expression();
			emit(OPR, 0, NEQ);
		}
		else iftt(lsssym)
		{
			gettoken();
			expression();
			emit(OPR, 0, LSS);
		}
		else iftt(leqsym)
		{
			gettoken();
			expression();
			emit(OPR, 0, LEQ);
		}
		else iftt(gtrsym)
		{
			gettoken();
			expression();
			emit(OPR, 0, GTR);
		}
		else iftt(geqsym)
		{
			gettoken();
			expression();
			emit(OPR, 0, GEQ);
		}
		else
			printparseerror(errRelationMissing);

	}
	return;
}
// processes an expression
void expression()
{
	iftt(subsym)
	{
		gettoken();
		term();
		// Things break when this code is run despite being in the pseudo code.
		//emit(OPR, 0, NEG);
		while (token.type == addsym || token.type == subsym)
		{
			iftt(addsym)
			{
				gettoken();
				term();
				emit(OPR, 0, ADD);
			}
			else
			{
				gettoken();
				term();
				emit(OPR, 0, SUB);
			}
		}
	}
	else
	{
		iftt(addsym)
			gettoken();
		term();
		while (token.type == addsym || token.type == subsym)
		{
			iftt(addsym)
			{
				gettoken();
				term();
				emit(OPR, 0, ADD);
			}
			else
			{
			gettoken();
			term();
			emit(OPR, 0, SUB);
			}
		}
	}
	// ADDITIONAL CHECK REQUIRED
	// "num (" is invalid according to our syntax structure. This solves this.
	if (token.type == oddsym || token.type == lparensym || token.type == identsym || token.type == numbersym)
		printparseerror(errBadArithmeticLogic);
	return;
}
// processes a term
void term()
{
	factor();
	while (token.type == multsym || token.type == divsym || token.type == modsym)
	{
		iftt(multsym)
		{
			gettoken();
			factor();
			emit(OPR, 0, MUL);
		}
		else iftt(divsym)
		{
			gettoken();
			factor();
			emit(OPR, 0, DIV); 
		}
		else
		{
			gettoken();
			factor();
			emit(OPR, 0, MOD);
		}
	}
	return;
}
// processes factors
void factor()
{
	iftt(identsym)
	{
		symIdx_var = findsymbol(token, 2);
		symIdx_const = findsymbol(token, 1);
		if (symIdx_var == -1 && symIdx_const == -1)
		{
			if (findsymbol(token, 3) != -1)
				printparseerror(errArithmetic);
			else
				printparseerror(errUndeclared);
		}
		if (symIdx_var == -1)
		{
			emit(LIT, 0, table[symIdx_const].val);
		}
		else if (symIdx_const == -1 || table[symIdx_var].level > table[symIdx_const].level)
		{
			emit(LOD, level - table[symIdx_var].level, table[symIdx_var].addr);
		}
		else
			emit(LIT, 0, table[symIdx_const].val);
		gettoken();
	}
	else iftt(numbersym)
	{
		emit(LIT, 0, token.value);
		gettoken();
	}
	else iftt(lparensym)
	{
		gettoken();
		expression();
		ifttn(rparensym)
			printparseerror(errFollowBy);
		gettoken();
	}
	else
		printparseerror(errArithmetic);
	return;
}
// gets a token from the token list
lexeme gettoken()
{	
	strcpy(token.name, tokens[tokenaccess].name);
	token.type = tokens[tokenaccess].type;
	token.value = tokens[tokenaccess].value;

	tokenaccess++;
	

	return token;
}
// marks all tokens with valid criteria
void mark()
{
	int i = tIndex - 1;

	for (i; i >= 0; i--)
	{
		if (table[i].mark == unmarked && table[i].level == level)
		{
			table[i].mark = marked;
			continue;
		}
		else if (table[i].mark == unmarked && table[i].level < level)
			break;
	}
}
// checks for multiple declarations
int multipledeclarationcheck(lexeme input)
{
	int ret = -1;
	int i = 0;

	for (i; i < tIndex; i++)
	{
		if (strcmp(input.name, table[i].name) == 0 && table[i].mark == unmarked && table[i].level == level)
		{
			ret = i;
			break;
		}
	}
	return ret;
}


// symbol search
int findsymbol(lexeme input, int kind)
{

	int i = 0;
	int ret = -1;
	int lastlevel = -1;
	int clevel = -1;
	for (i = tIndex -1; i >= 1; i--)
	{
		if (table[i].kind == kind && strcmp(input.name, table[i].name) == 0 && table[i].mark == unmarked)
		{
			clevel = table[i].level;
			if (clevel >= lastlevel)
			{
				lastlevel = clevel;
				ret = i;
			}

		}
	}

	return ret;
}

void emit(int opname, int level, int mvalue)
{
	code[cIndex].opcode = opname;
	code[cIndex].l = level;
	code[cIndex].m = mvalue;
	cIndex++;
}

void addToSymbolTable(int k, char n[], int v, int l, int a, int m)
{
	table[tIndex].kind = k;
	strcpy(table[tIndex].name, n);
	table[tIndex].val = v;
	table[tIndex].level = l;
	table[tIndex].addr = a;
	table[tIndex].mark = m;
	tIndex++;
}



void printparseerror(int err_code)
{
	{
		switch (err_code)
		{
		case errPeriod:
			printf("Parser Error: Program must be closed by a period\n");
			break;
		case errConstDeclare:
			printf("Parser Error: Constant declarations should follow the pattern 'ident := number {, ident := number}'\n");
			break;
		case errVarDeclare:
			printf("Parser Error: Variable declarations should follow the pattern 'ident {, ident}'\n");
			break;
		case errProcedureDeclare:
			printf("Parser Error: Procedure declarations should follow the pattern 'ident ;'\n");
			break;
		case errAssign:
			printf("Parser Error: Variables must be assigned using :=\n");
			break;
		case errAssignRead:
			printf("Parser Error: Only variables may be assigned to or read\n");
			break;
		case errCallProcedurem:
			printf("Parser Error: call must be followed by a procedure identifier\n");
			break;
		case errIfThen:
			printf("Parser Error: if must be followed by then\n");
			break;
		case errWhileDo:
			printf("Parser Error: while must be followed by do\n");
			break;
		case errRelationMissing:
			printf("Parser Error: Relational operator missing from condition\n");
			break;
		case errArithmetic:
			printf("Parser Error: Arithmetic expressions may only contain arithmetic operators, numbers, parentheses, constants, and variables\n");
			break;
		case errFollowBy:
			printf("Parser Error: ( must be followed by )\n");
			break;
		case errMultiSymbolSeperation:
			printf("Parser Error: Multiple symbols in variable and constant declarations must be separated by commas\n");
			break;
		case errSymbolSemicolon:
			printf("Parser Error: Symbol declarations should close with a semicolon\n");
			break;
		case errBeginEndSemiColon:
			printf("Parser Error: Statements within begin-end must be separated by a semicolon\n");
			break;
		case errBeginEnd:
			printf("Parser Error: begin must be followed by end\n");
			break;
		case errBadArithmeticLogic:
			printf("Parser Error: Bad arithmetic\n");
			break;
		case errConflictSymbols:
			printf("Parser Error: Confliciting symbol declarations\n");
			break;
		case errUndeclared:
			printf("Parser Error: Undeclared identifier\n");
			break;
		default:
			printf("Implementation Error: unrecognized error code\n");
			break;
		}

		free(code);
		free(table);

		code = NULL;
		table = NULL;


		exit(0);
	}
}

void printsymboltable()
{
	int i;
	printf("Symbol Table:\n");
	printf("Kind | Name        | Value | Level | Address | Mark\n");
	printf("---------------------------------------------------\n");
	for (i = 0; i < tIndex; i++)
		printf("%4d | %11s | %5d | %5d | %5d | %5d\n", table[i].kind, table[i].name, table[i].val, table[i].level, table[i].addr, table[i].mark); 
	
	free(table);
	table = NULL;
}

void printassemblycode()
{
	int i;
	printf("Line\tOP Code\tOP Name\tL\tM\n");
	for (i = 0; i < cIndex; i++)
	{
		printf("%d\t", i);
		printf("%d\t", code[i].opcode);
		switch (code[i].opcode)
		{
			case 1:
				printf("LIT\t");
				break;
			case 2:
				switch (code[i].m)
				{
					case 0:
						printf("RTN\t");
						break;
					case 1:
						printf("NEG\t");
						break;
					case 2:
						printf("ADD\t");
						break;
					case 3:
						printf("SUB\t");
						break;
					case 4:
						printf("MUL\t");
						break;
					case 5:
						printf("DIV\t");
						break;
					case 6:
						printf("ODD\t");
						break;
					case 7:
						printf("MOD\t");
						break;
					case 8:
						printf("EQL\t");
						break;
					case 9:
						printf("NEQ\t");
						break;
					case 10:
						printf("LSS\t");
						break;
					case 11:
						printf("LEQ\t");
						break;
					case 12:
						printf("GTR\t");
						break;
					case 13:
						printf("GEQ\t");
						break;
					default:
						printf("err\t");
						break;
				}
				break;
			case 3:
				printf("LOD\t");
				break;
			case 4:
				printf("STO\t");
				break;
			case 5:
				printf("CAL\t");
				break;
			case 6:
				printf("INC\t");
				break;
			case 7:
				printf("JMP\t");
				break;
			case 8:
				printf("JPC\t");
				break;
			case 9:
				switch (code[i].m)
				{
					case 1:
						printf("WRT\t");
						break;
					case 2:
						printf("RED\t");
						break;
					case 3:
						printf("HAL\t");
						break;
					default:
						printf("err\t");
						break;
				}
				break;
			default:
				printf("err\t");
				break;
		}
		printf("%d\t%d\n", code[i].l, code[i].m);
	}
	if (table != NULL)
		free(table);
}