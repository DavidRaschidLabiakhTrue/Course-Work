/*=============================================================================
 |       Author:  David Raschid Labiakh-True
 +=============================================================================*/

#include <iostream> // printing
#include <cstdio> // formatting
#include <string> // string utils

#include <bitset> // The hero of this program.



using namespace std; // Getting used to this still. Still Hate it. I see it's use with typedefing and auto renaming *only*.

typedef FILE* File_PTR; // File Pointer Naming Schema Simplified. '*' Pointer notation belongs in the past as does C++'s stock file functions. 
typedef unsigned long int Bitties; // Unsigned Long Integer Generally ensured to be at least 32 bit. Yes I am choosing this name.
typedef unsigned long long int BittyBuffer; // Short term Buffer Option. Unviable for 64 bit Checksum




// It will be a cold day in hell before I write direct Hex Values into code.
enum CheckSumCutOff { Bit8Cut = 0xFF, Bit16Cut = 0xFFFF, Bit32Cut = 0xFFFFFFFF};
// Clarity
enum BitRange { Bit8Range= 8, Bit16Range = 16, Bit32Range = 32};

#define READ_MODE "r"
// Not redundantantly named. It's a define Macro, it expands at compile time. This tells the reader what a 0 is doing somewhere.
#define ResetToZero 0
#define EmptyBuffer 0
#define AsciiXPad 'X'
// Divide by 8 == shift by 3.
#define DivideRangeByEight 3
#define ShiftByEight 8
#define lineLimiter 80


class Type_CheckSum
{
	public:
		// Storing the Bit Range internally
		BitRange internalRange;
		// Holds the max step inputted via dispatch.
		int step;
		
		// Yes this is really 1 function only. I don't see a need elsewise.
		bool RunCheckSum(char* fileName, char* bitSize)
		{
			
			// File Pointer
			register File_PTR inputFile;
			register int limitTracker = ResetToZero;
			// Holds the current ascii char being parsed.
			register char characterBuffer;
			// tracks the blocksize traversal against the step.
			register int stepping = ResetToZero;
			// Total amount of chars processed
			register int total = ResetToZero;
			// Bitty Buffer. Blocks are concat. together here.
			register Bitties buffer = ResetToZero;
			// Running final value. Chopped off at the end to reveal the checksum.
			register Bitties lastBitties = ResetToZero;

			try 
			{ 			
				internalRange = static_cast<BitRange>(stoi(bitSize)); // Try to get a number.	
				if (internalRange != Bit8Range && internalRange != Bit16Range && internalRange != Bit32Range) { return invalidRangeError();} // Try to see if it's a valid number.
				else { step = static_cast<int>(internalRange) >> DivideRangeByEight;} // If it's a valid number, it can be divided by 8 to set the step.
			}
			catch (const std::exception& e) { return invalidRangeError(); } // Catch the exception in the event stoi() begins whining.
			
			if ((inputFile = fopen(fileName, READ_MODE)) == NULL) { return false;} // File is not here or Access is denied.
			
			while ((characterBuffer = fgetc(inputFile)) != EOF)
			{
				if (limitTracker == lineLimiter)
				{
					limitTracker = ResetToZero;
					cout << endl;
				}
				cout << characterBuffer;
				total++;
				limitTracker++;
				buffer = (buffer << ShiftByEight) + int(characterBuffer);
				if (++stepping == step)
				{
					lastBitties += buffer;
					buffer = ResetToZero; // Zero out the memory slots
					stepping = ResetToZero;
				}
			}
			// Close the file.
			fclose(inputFile);
			// Check for remainders..
			if (stepping != ResetToZero && buffer != EmptyBuffer)
			{
				for (stepping; stepping < step; stepping++)
				{
					if (limitTracker == lineLimiter)
					{
						limitTracker = ResetToZero;
						cout << endl;
					}
					limitTracker++;
					cout << AsciiXPad;
					total++;
					buffer = (buffer << ShiftByEight) + int(AsciiXPad);
				}
				lastBitties += buffer;
			}
			switch (internalRange)
			{
				case Bit8Range:  lastBitties = lastBitties & Bit8Cut;
					break;
				case Bit16Range: lastBitties = lastBitties & Bit16Cut;
					break;
				case Bit32Range: lastBitties = lastBitties & Bit32Cut;
					break;
			}
			cout << "\n" << bitSize << " bit checksum is " << std::hex << lastBitties << " for all " << std::dec << total << " chars" << endl;
			return true;
		}
	private:
		bool invalidRangeError()
		{
			fprintf(stderr, "Valid checksum sizes are 8, 16, or 32\n");
			return false;
		}
};

int main(int argc, char **args)
{
	// output Format requests it.
	cout << endl;
	if (argc < 2)
		return 0;
	
	Type_CheckSum CheckSumOperator;
	CheckSumOperator.RunCheckSum(args[1], args[2]);

	return 0;
}