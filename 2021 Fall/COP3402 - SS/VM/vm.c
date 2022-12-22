


#include <stdio.h> // Input Output IO
#include <stdlib.h> // NULL macro
#include <string.h> // strcmp(...)



enum VAL_opCode { LIT = 1, OPR = 2, LOD = 3, STO = 4, CAL = 5, INC = 6, JMP = 7, JPC = 8, SYS = 9 };
const char* STR_opcodes[10] = { "ERROR", "LIT", "OPR", "LOD", "STO", "CAL", "INC", "JMP", "JPC", "SYS" };


enum VAL_OperatorCode { RTN, NEG, ADD, SUB, MUL, DIV, ODD, MOD, EQL, NEQ, LSS, LEQ, GTR, GEQ };
const char* STR_OPRCodes[14] = { "RTN", "NEG", "ADD", "SUB", "MUL", "DIV", "ODD", "MOD", "EQL", "NEQ", "LSS", "LEQ", "GTR", "GEQ" };

enum SysCommands{PrintTopOfStack = 1, ReadInput = 2, HaltProgram = 3};

// Max length of pas
#define MAX_PAS_LENGTH 500
// syntactic suger 0ed-out initialization 
#define INITIALIZE_Elements {0}
#define EMPTYARGUMENT ""
#define BADARGUMENT "Correct Usage: ./a {validTxtFile}.txt\n"
#define INVALIDINSTRUCTION "INVALID INSTRUCTIONS DETECTED\n"
// Clarification Macro
#define FILENOTFOUND NULL
// Clarification Macro
#define INCREMENTPC_3 3
// Clarification Macro
#define StringArguments char**
// Clarification Macro
#define ArgumentCount int
// Clarification Macro
#define IntParser int
// Clarification Macro / Don't need an entire library linked.
#define BOOL int

// Clarification Macro / Don't need overhead of defining new types.
#define ProcessAddressSPC int
#define InstructionRegister int

// syntactic suger operator labels
#define Equals ==
#define DoesNotEqual !=
#define Or	||

// Clarification Macros for accessing IR elements
#define OP 0
#define L 1
#define M 2

void print_execution(int line, const char* opname, int* IR, int PC, int BP, int SP, int DP, int* pas, int GP);
int base(int Level, int* pas, int BP);

InstructionRegister IR[3] = INITIALIZE_Elements; // Instruction Register
ProcessAddressSPC pas[MAX_PAS_LENGTH] = INITIALIZE_Elements; // Process Address Space
int main(ArgumentCount argc, StringArguments argv)
{
	IntParser parsedElement; // Variable for getting numbers out of file.
	BOOL haltFlag = 1;
	register FILE* FileInput;
		
	// register -> "suggestion"(Forcing in GCC) the compiler to store these variables in the CPU register. 
	// This means: They run much much faster. They cannot have their address (&) computed because they have no real address.
	register int levelOp = 0;
	register int IC = 0;
	register int GP = 0;
	register int DP = 0;
	register int FREE = 0;
	register int BP = 0;
	register int PC = 0;
	register int SP = 0;
	

	if (argc DoesNotEqual 2 Or strcmp(argv[1], EMPTYARGUMENT) Equals 0 Or (FileInput = fopen(argv[1], "r")) Equals FILENOTFOUND)
	{
		fprintf(stderr, BADARGUMENT);
		return (0);
	}
	else
	{
		while (fscanf(FileInput, "%d", &parsedElement) DoesNotEqual EOF)
		{
			pas[IC++] = parsedElement;
		}
		fclose(FileInput);
	}

	

	GP = IC; // Global Pointer
	DP = IC - 1; //Data Pointer – To access variables in Main
	FREE = IC + 10; // FREE points to Heap
	BP = IC; // Points to base of DATA or activation records
	PC = 0; // Stack pointer – Points to top of stack  
	SP = MAX_PAS_LENGTH;

	printf("\t\t\tPC\tBP\tSP\tDP\tdata\n");
	printf("Initial values:\t\t%d\t%d\t%d\t%d\n", PC, BP, SP, DP);

	while (haltFlag)
	{
		IR[OP] = pas[PC + OP];
		IR[L] = pas[PC + L];
		IR[M] = pas[PC + M];
		levelOp = (PC + OP) / 3;

		PC += INCREMENTPC_3;

		switch (IR[OP])
		{
			// Self Explanatory cases.

			// Push Constant
			case LIT:

				if (BP Equals GP)
				{
					DP++;
					pas[DP] = IR[M];
				}
				else
				{
					SP--;
					pas[SP] = IR[M];
				}
				break;
			// Math Operations
			case OPR:
				// Self explanatory Cases.
				switch (IR[M])
				{
					case RTN:
						SP = BP + 1;
						BP = pas[SP - 2];
						PC = pas[SP - 3];
						break;
					case NEG:
						if (BP Equals GP)
							pas[DP] = -1 * pas[DP];
						else
							pas[SP] = -1 * pas[SP];
						break;
					case ADD:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] += pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] += pas[SP - 1];
						}
						break;
					case SUB:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] - pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] - pas[SP - 1];
						}
						break;
					case MUL:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] *= pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] * pas[SP - 1];
						}
						break;
					case DIV:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] /= pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] /= pas[SP - 1];
						}
						break;
					case ODD:
						if (BP Equals GP)
						{
							pas[DP] = pas[DP] % 2;
						}
						else
						{
							pas[SP] = pas[SP] % 2;
						}
						break;
					case MOD:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] %= pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] %= pas[SP - 1];
						}
						break;
					case EQL:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] Equals pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] Equals pas[SP - 1];
						}
						break;
					case NEQ:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] DoesNotEqual pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] DoesNotEqual pas[SP - 1];
						}
						break;
					case LSS:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] < pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] < pas[SP - 1];
						}
						break;
					case LEQ:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] <= pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] <= pas[SP - 1];
						}
						break;
					case GTR:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] > pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] > pas[SP - 1];
						}
						break;
					case GEQ:
						if (BP Equals GP)
						{
							--DP;
							pas[DP] = pas[DP] >= pas[DP + 1];
						}
						else
						{
							++SP;
							pas[SP] = pas[SP] >= pas[SP - 1];
						}
						break;
					default: 
						printf(INVALIDINSTRUCTION);
						return 0;
					}
				break;
			// Load on Top M Down from Level
			case LOD:
				if (BP Equals GP)
					pas[++DP] = pas[GP + IR[M]];
				else
					pas[--SP] = (base(IR[L], pas, BP) Equals GP) ? pas[GP + IR[M]] : pas[base(IR[L], pas, BP) - IR[M]];
				break;
			// Store on Top M Down from Level
			case STO:
				if (BP Equals GP)
				{
					pas[GP + IR[M]] = pas[DP];
					--DP;
				}
				else
				{
					if (base(IR[L], pas, BP) Equals GP)
					{
						pas[GP + IR[M]] = pas[SP];
						SP++;
					}
					else
					{
						pas[base(IR[L], pas, BP) - IR[M]] = pas[SP];
						SP++;
					}
				}
				break;
			// Generate new activation record
			case CAL:
				pas[SP - 1] = base(IR[L], pas, BP);
				pas[SP - 2] = BP;
				pas[SP - 3] = PC;
				BP = SP - 1;
				PC = IR[M];
				break;
			// Allocate M words.
			case INC:
				if (BP Equals GP)
				{
					DP += IR[M];
				}
				else
				{
					SP -= IR[M];
				}
				break;
			// Jump to another instruction
			case JMP:
				PC = IR[M];
				break;
			// Jump to M if Top Stack Empty
			case JPC:
				if (BP Equals GP)
				{
					if (pas[DP--] Equals 0)
						PC = IR[M];
				}
				else
				{
					if (pas[SP++] Equals 0)
						PC = IR[M];
				}
				break;
			case SYS:
				switch (IR[M])
				{
				case PrintTopOfStack:
					if (BP Equals GP)
						printf("Top of Stack Value: %d\n", pas[DP--]);
					else
						printf("Top of Stack Value: %d\n", pas[SP++]);
					break;
				case ReadInput:
					if (BP Equals GP)
					{
						printf("Please Enter an Integer: ");
						DP++;
						scanf("%d", &pas[DP]);
					}
					else
					{
						printf("Please Enter an Integer: ");
						SP--;
						scanf("%d", &pas[SP]);
					}
					break;
				case HaltProgram:
					haltFlag--;
					break;
				}
				break;
			default:
				printf(INVALIDINSTRUCTION);
				return 0;
			}
			if (IR[OP] DoesNotEqual OPR)
				print_execution(levelOp, STR_opcodes[IR[OP]], IR, PC, BP, SP, DP, pas, GP);
			else
				print_execution(levelOp, STR_OPRCodes[IR[M]], IR, PC, BP, SP, DP, pas, GP);
	}
	return 0;
}

int base(int Level, int* pas, int BP)
{
	int arb = BP;	// arb = activation record base
	while (Level > 0)     //find base L levels down
	{
		arb = pas[arb];
		Level--;
	}
	return arb;
}
void print_execution(int line, const char* opname, int* IR, int PC, int BP, int SP, int DP, int* pas, int GP)
{
	register int i;
	// print out instruction and registers
	printf("%2d\t%s\t%d\t%d\t%d\t%d\t%d\t%d\t", line, opname, IR[L], IR[M], PC, BP, SP, DP);

	// print data section
	for (i = GP; i <= DP; i++)
	{
		printf("%d ", pas[i]);
	}
	printf("\n");

	// print stack
	printf("\tstack : ");
	for (i = MAX_PAS_LENGTH - 1; i >= SP; i--)
		printf("%d ", pas[i]);
	printf("\n");
}