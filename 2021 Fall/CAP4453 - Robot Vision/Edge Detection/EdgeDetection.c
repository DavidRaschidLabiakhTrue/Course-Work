/*
	David Raschid Labiakh-True
*/

#include <stdio.h>  /* Sobel.c */
#include <stdlib.h> /* atof(cString) */
#include <ctype.h>  /* isdigit(cchar)*/
#include <math.h>   /* sqrt(cdouble)*/

// Clarity constants
#define PixelLimit 256

/* 
255, 0xff, I am honestly unsure what this is supposed to do from the original source code. Removing it does nothing to the output.
   Feel almost as if it's a test to see if a Student BSs an explanation.
   Perhaps it converts color based pgm files to grayscale?
*/
#define CNST_AND_WhiteMask 0377; 

#define Whitening 255
#define Blackening 0

// Drop bool.h
#define CNST_Safe 1
#define CNST_Unsafe (-1) 

// I am uncomfortable with the amount of global variables.
int pic[PixelLimit][PixelLimit];
int outpicx[PixelLimit][PixelLimit];
int outpicy[PixelLimit][PixelLimit];
int maskx[3][3] = {{-1, 0, 1},
				   {-2, 0, 2},
				   {-1, 0, 1}};

int masky[3][3] = {{ 1, 2, 1},
				   { 0, 0, 0},
				   {-1,-2,-1}};
double ival[PixelLimit][PixelLimit],maxival;

// Largely ordered in usage.
int usageWarning();
int assertDouble(const char* testFloat);
void setFilePTR_After_pgmHeader(FILE* inputFile);
void print_pgmHeader(FILE* outputFile);

void fillPicture(const int OriginalLimit, FILE* FileIn);

void SobelScanningConvolution(const int maskRadius, const int ParseLimit);
void singlePlaceConvolution(const int maskRadius, const int i, const int j);

void computeMaximumMagnitude(const int maskRadius, const int ParseLimit);
void printMainFile(const int OriginalLimit, FILE* fileOutPtr);
void printThresholdFile(const double thresholdLow, FILE* fileLowThreshold, const double thresholdHigh, FILE* fileHighThreshold);

int main(int argc, char** argv)
{
	register double thresholdHigh, thresholdLow;
	register const int maskRadius = 1; // Pixel Mask radius for going around the file.
	register const int OriginalLimit = PixelLimit; // Limiter for the parsed file
	register const int ParseLimit = OriginalLimit - maskRadius; // The original source code does not care for the image edges while computing. This is to provide a limit to ignore those.
	FILE* fopen();
	register FILE* FileIn, * fileOut, * fileLowThreshold, * fileHighThreshold;

	// Safety
	if ((argc != 4) ||
		(FileIn = fopen(argv[1], "rb")) == NULL ||
		assertDouble(argv[2]) == CNST_Unsafe ||
		assertDouble(argv[3]) == CNST_Unsafe)
	{
		return usageWarning();
	}

	thresholdLow = atof(argv[2]);
	thresholdHigh = atof(argv[3]);
	// add the file headers to the new files.
	print_pgmHeader(fileOut = fopen("sobelmag.pgm", "wb"));
	print_pgmHeader(fileLowThreshold = fopen("sobelout1.pgm", "wb"));
	print_pgmHeader(fileHighThreshold = fopen("sobelout2.pgm", "wb"));

	fillPicture(OriginalLimit, FileIn); // Fill up the initial image first. - Global

	SobelScanningConvolution(maskRadius, ParseLimit); // Scanning Convolution - Global
	computeMaximumMagnitude(maskRadius, ParseLimit); // Compute the Maximum Magnitude - Global
	printMainFile(OriginalLimit, fileOut); // Print the magnitude file - Output file
	printThresholdFile(thresholdLow, fileLowThreshold, thresholdHigh, fileHighThreshold); // Print the Threshold files - Output file

	// Clean Up Time.
	fclose(FileIn);
	fclose(fileOut);
	fclose(fileLowThreshold);
	fclose(fileHighThreshold);
	return 0;
}

// Advances the file ptr position past the header of the input file
void setFilePTR_After_pgmHeader(FILE* inputFile)
{
	register int headerLine = 0;
	while (headerLine != 3)
		if (fgetc(inputFile) == '\n' && (++headerLine));
}

// Adds the header to created files
void print_pgmHeader(FILE* outputFile)
{
	fprintf(outputFile, "P5\n256 256\n255\n");
}

// Fills the high and low threshold files
void printThresholdFile(const double thresholdLow, FILE* fileLowThreshold, const double thresholdHigh, FILE* fileHighThreshold)
{
	register int i, j;
	for (i = 0; i < PixelLimit; i++)
	{
		for (j = 0; j < PixelLimit; j++)
		{
			// If the entry is above the lower threshold, whiten that entry. Otherwise, Blacken it.
			(ival[i][j] > thresholdLow) ? fprintf(fileLowThreshold, "%c", (char)((int)(Whitening)))  : fprintf(fileLowThreshold, "%c", (char)((int)(Blackening)));

			(ival[i][j] > thresholdHigh) ? fprintf(fileHighThreshold, "%c", (char)((int)(Whitening))) : fprintf(fileHighThreshold, "%c", (char)((int)(Blackening)));
		}
	}
}
// Standard usage warning granted to invalid argument inputs
int usageWarning()
{
	printf("Usage: ./programName {fileName}.pgm {double/int low threshold} {double/int high threshold}");
	return 1;
}
// ensures positive or 0 valued double input is correct
int assertDouble(const char* testFloat)
{
	int i = 0;
	int point = 0;
	double res;
	for (i = 0; testFloat[i] != '\0'; i++)
	{
		if (isdigit(testFloat[i]))
			continue;
		if (testFloat[i] == '.')
		{
			if (point >= 1)
				return CNST_Unsafe; // Threshold unsupported.
			++point;
			continue;
		}
		return CNST_Unsafe; // Threshold unsupported.
	}
	return CNST_Safe;
}

void singlePlaceConvolution(const int maskRadius, const int i, const int j)
{
	register int Horizontal_Mask_offset, Vertical_Mask_offset; // I don't know if I see a point in making the names mysteries. Perhaps get the student to think about what it could be?
	register double XSum = 0, YSum = 0;

	for (Vertical_Mask_offset = -maskRadius; Vertical_Mask_offset <= maskRadius; Vertical_Mask_offset++)
	{
		for (Horizontal_Mask_offset = -maskRadius; Horizontal_Mask_offset <= maskRadius; Horizontal_Mask_offset++)
		{
			// For clarities sake, this accesses a local 3x3 grid mask on each element and computes a single place convolution in a 3x3 area for x and y.
			XSum += pic[i + Vertical_Mask_offset][j + Horizontal_Mask_offset] * maskx[Vertical_Mask_offset + maskRadius][Horizontal_Mask_offset + maskRadius];
			YSum += pic[i + Vertical_Mask_offset][j + Horizontal_Mask_offset] * masky[Vertical_Mask_offset + maskRadius][Horizontal_Mask_offset + maskRadius];
		}
	}
	outpicx[i][j] = XSum;
	outpicy[i][j] = YSum;
}

void SobelScanningConvolution(const int maskRadius, const int ParseLimit)
{
	register int i, j;
	for (i = maskRadius; i < ParseLimit; i++)
	{
		for (j = maskRadius; j < ParseLimit; j++)
		{
			singlePlaceConvolution(maskRadius, i, j);
		}
	}
}
void fillPicture(const int OriginalLimit, FILE *FileIn)
{
	register int i, j;
	setFilePTR_After_pgmHeader(FileIn);
	for (i = 0; i < OriginalLimit; i++)
	{
		for (j = 0; j < OriginalLimit; j++)
			pic[i][j] = getc(FileIn) & CNST_AND_WhiteMask; // I am unconvinced the &= 0377 even does anything for grey scale images.
	}
}
void computeMaximumMagnitude(const int maskRadius, const int ParseLimit)
{
	register int i, j;
	for (i = maskRadius; i < ParseLimit; i++)
	{
		for (j = maskRadius; j < ParseLimit; j++)
		{
			if ((ival[i][j] = sqrt((double)((outpicx[i][j] * outpicx[i][j]) + (outpicy[i][j] * outpicy[i][j])))) > maxival)
				maxival = ival[i][j];
		}
	}
}
void printMainFile(const int OriginalLimit, FILE* fileOutPtr)
{
	register int i, j;
	for (i = 0; i < OriginalLimit; i++)
	{
		for (j = 0; j < OriginalLimit; j++)
			fprintf(fileOutPtr, "%c", (char)((int)((ival[i][j] = (ival[i][j] / maxival) * Whitening))));
	}
}