
#include <stdlib.h>
#include "UnlistedClassHeaderDueToLegalReasons.h"

#define ALPHA_POW 26

#define CHAR_CNST ('a'-1)

#define BIT 0x00000001

#define BF_LEN 8

#define TOGGLE_ON(BIT_coord, toggle_Nth_BIT) ((BIT_coord) |= BIT << (toggle_Nth_BIT))

#define FREE_AND_SET_NULL(argument) ((free(argument)), (argument = NULL))

#define LOWER_BY_ONE(argument1, argument2) ((--argument1), (--argument2))

typedef unsigned char BYTE;

typedef struct BIT_FIELD
{
	BYTE BIT_row: BF_LEN;
	BYTE BIT_col: BF_LEN;
}BIT_FIELD;
int    allTheRooksAreSafe(char **rookStrings, int numRooks, int boardSize);
void   parseCoordinateString(char *rookString, Coordinate *rookCoordinate);

// Function Overview: Using BITs to access and to store, positional flags
// 1--------------R 1--------------R 0                0
// 0              | 1------------R | 0     Not Safe   0     Not Safe
// 1------R       | 1----------R | | 1--------R       1--R---------R
// 0      |       | 1--------R | | | 0        |       0  |         |
// 0      |       | 1------R | | | | 0        |       0  |         |
// 0      |       | 1----R | | | | | 1--------R       0  |         |
// 1------------R | 1--R | | | | | | 0        |       0  |         |
// 0      |     | | 1R | | | | | | | 0        |       0  |         |
//  0 0 0 1 0 0 1 1  1 1 1 1 1 1 1 1  0 0 0 0 1 0 0 0  0 1 0 0 0 0 1 0

int allTheRooksAreSafe(char **rookStrings, int numRooks, int boardSize)
{
	Coordinate  rook_dat = {0};
	BIT_FIELD  *BIT_ptr  = NULL;
	if (numRooks <= 1)
	{
		return 1;
	}

	if ((unsigned int)numRooks >= (unsigned int)boardSize + 1)
	{
		return 0;
	}
	if ((BIT_ptr = calloc(boardSize/BF_LEN + 1, sizeof(BIT_FIELD))) == NULL)
	{
		return 0;
	}
	while (--numRooks >= 0)
	{
		parseCoordinateString(rookStrings[numRooks], &rook_dat);
		LOWER_BY_ONE(rook_dat.row, rook_dat.col);
		if ((BIT_ptr[(rook_dat.row) / BF_LEN].BIT_row & (BIT << ((rook_dat.row) % BF_LEN)) |
		   ((BIT_ptr[(rook_dat.col) / BF_LEN].BIT_col & (BIT << ((rook_dat.col) % BF_LEN)) ))))
		{
			FREE_AND_SET_NULL(BIT_ptr);
			return 0;
		}
		TOGGLE_ON(BIT_ptr[(rook_dat.row) / BF_LEN].BIT_row, (rook_dat.row) % BF_LEN);
		TOGGLE_ON(BIT_ptr[(rook_dat.col) / BF_LEN].BIT_col, (rook_dat.col) % BF_LEN);
	}
	FREE_AND_SET_NULL(BIT_ptr);
	return 1;
}
void parseCoordinateString(char *rookString, Coordinate *rookCoordinate)
{
	register unsigned int POW =  1;
	register short index      = -1;

	rookCoordinate->row = rookCoordinate->col = 0;

	while (rookString[++index] > CHAR_CNST);

	rookCoordinate->row = atoi(rookString + index);

	rookCoordinate->col = (rookString[--index] - CHAR_CNST);

	while (index != 0)
	{
		rookCoordinate->col += (POW *= ALPHA_POW) * (rookString[--index] - CHAR_CNST);
	}
	return;
}

