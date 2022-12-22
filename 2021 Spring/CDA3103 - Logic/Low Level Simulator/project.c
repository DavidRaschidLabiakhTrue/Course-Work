#include "UnlistedClassHeaderDueToLegalReasons.h" //"spimcore.h"


enum ALU_operators
{
	opAdd = 0x0,
	opSubtract = 0x1,
	opSignLessThan = 0x2,
	opUnsignedLessThan = 0x3,
	opAnd = 0x4,
	opOr = 0x5,
	opLeftShift= 0x6,
	opUnaryNot = 0x7
};


// ALU_operations(...) constants for possible "funct" cases.
enum ALU_operation_cases
{
	functAdd = 0x20,
	functSubtract = 0x22,
	functAnd = 0x24,
	functOr = 0x25,
	functSignLessThan = 0x2A,
	functSignLessThanUnsigned = 0x2B,
	functLeftShift = 0x26,
	functUnaryNot = 0x27
};

// instruction_partition(...) constants enumerated for readability and documentation.
// See instruction_partition for expanded detail.
enum const_partitions
{

	constMatchOpInstruct = 26,
	constMatchRtype = 31,
	shiftRType1 = 21,
	shiftRType2 = 16,
	shiftRType3 = 11,
	constMatchFunction = 0x3F,
	constMatchOffset = 0xFFFF,
	constMatchJsec = 0x3FFFFFF
};

// instruction_decode(...) constants for possible "op" cases.
enum const_decode_cases
{
	RType = 0x0,
	JumpTo = 0x2,
	BranchOnEqual = 0x4,
	Add_i = 0x8,
	LoadWord = 0x23,
	StoreWord = 0x2b,
	SetLessThan_i = 0xa,
	SetLessThanUnsign_i = 0xb,
	LoadUpper_i=0xf
};

// Macro constants that otherwise just don't fit very well inside an enumerated set of constants.

// For generic variable % 4 testing,
// N % M == N & (M-1) when M power of 2.So N % 4 can be written as N & 3. On average, 45% faster. Utility wise, works with negatives as well.
#define modByFour 3
// Constant that sign extends an input if determined it's needed by Or Gating with 1111-1111-1111-1111-0000-0000-0000-0000 in binary.
#define constExtendSign 0xFFFF0000
// Constant documenting don't extend.
#define constDontExtend 0x0000ffff
// Constant that self documents bit shift to 15.
#define constCheck15thBit 15
// Memory Size constant for instruction fetch.
#define constMEMSIZE 65536

/* ALU */
/* 10 Points */
// Written By David Raschid Labiakh-True
void ALU(unsigned A, unsigned B, char ALUControl, unsigned *ALUresult, char *Zero)
{
	// Take in the ALUControl Value, match it's case, calculate the ALUresult.
	// If the ALUresult is 0, Zero will be set to 1 by logical NOT. Else it Zero will be 0 by logical NOT.
	// Self Documenting enumeration cases.
	switch(ALUControl)
	{
		case opAdd:
			*Zero = !(*ALUresult = A + B);
			return;
		case opSubtract:
			*Zero = !(*ALUresult = A - B);
			return;
		case opSignLessThan:
			*Zero = !(*ALUresult = (signed)A < (signed)B);
			 return;
		case opUnsignedLessThan:
			*Zero = !(*ALUresult = (unsigned)A < (unsigned)B);
			return;
		case opAnd:
			 *Zero = !(*ALUresult = A & B);
			return;
		case opOr:
			*Zero = !(*ALUresult = A | B);
			return;
		case opLeftShift:
			*Zero = !(*ALUresult = B << 16);
			return;
		case opUnaryNot:
			*Zero = !(*ALUresult = ~A);
			return;
		default:
			return;
	}
}

/* instruction fetch */
/* 10 Points */
// Written by Alden Bagarra
int instruction_fetch(unsigned PC, unsigned *Mem, unsigned *instruction)
{
  // Return 1 if a halt occurs, otherwise return 0.
  if(PC <= constMEMSIZE && (PC & modByFour) == 0){
    *instruction = Mem[(PC >> 2)];
    return 0;
  }
  return 1;
}

/* instruction partition */
/* 10 Points */
// Written By David Raschid Labiakh-True
void instruction_partition(unsigned instruction, unsigned *op, unsigned *r1, unsigned *r2, unsigned *r3, unsigned *funct, unsigned *offset, unsigned *jsec)
{
	// Shift right by 26 to match the last 6 bits to the op.
	*op = instruction >> constMatchOpInstruct;
	// Shift by differences of 5, (21, 16, 11), to isolate the 5 bit fields. Then & compare against constMatchRtype(0001-1111) to calculate and store.
	*r1 = (instruction >> shiftRType1) & constMatchRtype;
	*r2 = (instruction >> shiftRType2) & constMatchRtype;
	*r3 = (instruction >> shiftRType3) & constMatchRtype;
	// & compare against constMatchFunction(0011-1111) to match the first 6 LSBs.
	*funct = instruction & constMatchFunction;
	// & compare against constMatchOffset(1111-1111-1111-1111) to match the first 16 LSBs
	*offset = instruction & constMatchOffset;
	// & compare against constMatchJsec(0011-1111-1111-1111-1111-1111-1111) to match the first 26 LSBs
	*jsec = instruction & constMatchJsec;
	return;
}

/* instruction decode */
/* 15 Points */
// Written By David Raschid Labiakh-True
int instruction_decode(unsigned op, struct_controls *controls)
{
	// Self explanatory Switch Case naming via enumerated constants.
	// This function is a truth table match up.
	// Matches the controls structure to it's corresponding op's truth table.
	// Using struct casting to condense 99 potential lines to 11 lines.
	switch(op)
	{
		case LoadWord:
			*controls = (struct_controls){0, 0, 0, 1, 1, 0, 0, 1, 1};
			return 0;
		case LoadUpper_i:
			*controls = (struct_controls){0, 0, 0, 0, 0, 6, 0, 1, 1};
			return 0;
		case StoreWord:
			*controls = (struct_controls){2, 0, 0, 0, 2, 0, 1, 1, 0};
			return 0;
		case Add_i:
			*controls = (struct_controls){0, 0, 0, 0, 0, 0, 0, 1, 1};
			return 0;
		case BranchOnEqual:
			*controls = (struct_controls){2, 0, 1, 0, 2, 1, 0, 0, 0};
			return 0;
		case SetLessThan_i:
			*controls = (struct_controls){0, 0, 0, 0, 0, 2, 0, 1, 1};
			return 0;
		case SetLessThanUnsign_i:
			*controls = (struct_controls){0, 0, 0, 0, 0, 3, 0, 1, 1};
			return 0;

		case RType:
			*controls = (struct_controls){1, 0, 0, 0, 0, 7, 0, 0, 1};
			return 0;
		case JumpTo:
			*controls = (struct_controls){0, 1, 0, 0, 0, 0, 0, 0, 0};
			return 0;
		default:
			return 1;
	}
}

/* Read Register */
/* 5 Points */
// Written by Alden Bagarra
void read_register(unsigned r1, unsigned r2, unsigned *Reg, unsigned *data1, unsigned *data2)
{
	// Assigns data1 and data2 from r1 and r2 in Reg.
	*data1 = Reg[r1];
	*data2 = Reg[r2];
	return;
}

/* Sign Extend */
/* 10 Points */
// Written by Alden Bagarra
void sign_extend(unsigned offset, unsigned *extended_value)
{
	// "Is the 15th bit set?" The ternary condition will shift the 15th bit left and check if it's 1 to see if it needs sign extended.
	//The first ternary effect will take an offset and "or" the bits against 1111-1111-1111-1111-0000-0000-0000-0000
	*extended_value = ((offset >> constCheck15thBit) == 1) ?  (offset | constExtendSign) : (offset & constDontExtend);
	return;
}

/* ALU operations */
/* 10 Points */
// Written By David Raschid Labiakh-True
int ALU_operations(unsigned data1, unsigned data2, unsigned extended_value, unsigned funct, char ALUOp, char ALUSrc, unsigned *ALUresult, char *Zero)
{
	// Safety Check.
	if (ALUOp < 0 || ALUOp > 7)
		return 1;
	// Check for extension.
	if (ALUSrc == 1)
		data2 = extended_value;
	switch(ALUOp)
	{
		case 7:
			// Self explanatory enumerated case naming. All this does it match funct to ALUControl.
			// ALUcontrol is governed by ALUoperators enumerations.
			switch(funct)
			{
				case functAdd :
					ALU(data1, data2, opAdd, ALUresult, Zero);
					return 0;
				case functSubtract :
					ALU(data1, data2, opSubtract, ALUresult, Zero);
					return 0;
				case functAnd :
					ALU(data1, data2, opAnd, ALUresult, Zero);
					return 0;
				case functOr :
					ALU(data1, data2, opOr, ALUresult, Zero);
					return 0;
				case functSignLessThan :
					ALU(data1, data2, opSignLessThan, ALUresult, Zero);
					return 0;
				case functSignLessThanUnsigned :
					ALU(data1, data2, opUnsignedLessThan, ALUresult, Zero);
					return 0;
				case functLeftShift :
					ALU(data1, data2, opLeftShift, ALUresult, Zero);
					return 0;
				case functUnaryNot :
					ALU(data1, data2, opUnaryNot, ALUresult, Zero);
					return 0;
				default:
					return 1;
			}
		default:
			 ALU(data1, data2, ALUOp, ALUresult, Zero);
			 return 0;
	}
}

/* Read / Write Memory */
/* 10 Points */
// Written by Tyler Duncanson
int rw_memory(unsigned ALUresult, unsigned data2, char MemWrite, char MemRead, unsigned *memdata, unsigned *Mem)
{
	// If neither MemRead and Write is asserted or ALUresult is not a multiple of 4, halt.
	if ((MemRead || MemWrite) && ((ALUresult & modByFour) != 0 || (ALUresult >= constMEMSIZE)))
		return 1;
	// Read from memory into memdata if true.
	if (MemRead)
		*memdata = Mem[ALUresult >> 2];
	// Write data into memory if true.
	if (MemWrite)
		Mem[ALUresult >> 2] = data2;
	return 0;
}

/* Write Register */
/* 10 Points */
// Written by Tyler Duncanson
void write_register(unsigned r2, unsigned r3, unsigned memdata, unsigned ALUresult, char RegWrite, char RegDst, char MemtoReg, unsigned *Reg)
{
	// Halt condition.
	if (RegWrite == 1)
	{
		// Choose register.
		switch(MemtoReg)
		{
			case 0:
				// Choose register. Write result to chosen register.
				if (RegDst == 1)
					Reg[r3] = ALUresult;
				else
					Reg[r2] = ALUresult;
				return;
			case 1:
				// Write value to register.
				Reg[r2] = memdata;
				return;
			default:
				return;

		}
	}
	return;
}

/* PC update */
/* 10 Points */
// Written by Tyler Duncanson
void PC_update(unsigned jsec, unsigned extended_value, char Branch, char Jump,char Zero, unsigned *PC)
{
	// Update PC.
	*PC += 4;
	// Update PC for branch.
	if ((Branch == 1) && (Zero == 1))
		*PC += (extended_value << 2);
	// Update PC to jump.
	if (Jump == 1)
		*PC = (*PC & 0xf000000) | (jsec << 2);
	return;
}
