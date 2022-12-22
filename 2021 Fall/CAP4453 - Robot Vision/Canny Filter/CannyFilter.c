/*
	David Raschid Labiakh-True
*/

#include <stdlib.h> 
#include <stdio.h>
#include <math.h>
#include <ctype.h>

// Picture Size limits. 
#define PICSIZE 256
// Gaussian Mask Size Limits
#define MAXMASK 100

// Scalar Multiplier to "whiten" a pixel.
#define Whitening 255

#define MARKED 255


#define SAFE 1 
#define UNSAFE (-1)

#define TAN_67_5 2.4142
#define TAN_22_5 0.4142


int pic[PICSIZE][PICSIZE]; // Initial Image data
int edgeflag[PICSIZE][PICSIZE]; // Stores detected edges based off the angle
int histogram[PICSIZE]; // Records the frequency.
int final[PICSIZE][PICSIZE]; // Final Image output
double maskx[MAXMASK][MAXMASK]; // Contains gaussian mask weights
double masky[MAXMASK][MAXMASK]; // Contains gaussian mask weights
double convx[PICSIZE][PICSIZE]; // Contains the resulting convolution output
double convy[PICSIZE][PICSIZE]; // Contains the resulting convolution output
double ival[PICSIZE][PICSIZE]; // Contains the magnitude values resulting from square root of conv x and y.


int assertDouble(const char * restrict testFloat)
{
	register int i = 0;
	int point = 0;
	for (i = 0; testFloat[i] != '\0'; i++)
	{
		if (isdigit(testFloat[i]))
			continue;
		if (testFloat[i] == '.')
		{
			if (point >= 1)
				return UNSAFE; // 2 decimal points is not a valid double. 
			++point;
			continue;
		}
		return UNSAFE; // not number/letter detected.
	}
	return SAFE; // Clear to atof
}

// Print utility.
void show(char* restrict message)
{
	printf("%s\n", message);
};

int usageWarning()
{
	show("Usage: ./{executable name} {imagefileName}.pgm {double/integer percent} {double/integer sigma}");
	return UNSAFE;
};

// self explanatory.
void SetFilePTR_After_pgmHeader(FILE* restrict inputFile)
{
	register int headerLine = 0;
	while (headerLine != 3)
		if (fgetc(inputFile) == '\n' && (++headerLine));
	return;
};

// Read in a file
int ReadInputFile(char* restrict FileName)
{
	FILE* InputFile = fopen(FileName, "rb");
	register int i, j;
	if (InputFile == NULL)
	{
		show("Bad input");
		return UNSAFE;
	}
	SetFilePTR_After_pgmHeader(InputFile);
	for (i = 0; i < PICSIZE; i++)
		for (j = 0; j < PICSIZE; j++)
			pic[i][j] = getc(InputFile);
	fclose(InputFile);
	return SAFE;
};

// make a derivative mask in dim x and y.
void MakeCannyDerivativeMask(register const int MaskRadius, register const double sigma, register const int centx, register const int centy)
{
	register int vertical, horizontal;
	for (vertical = -MaskRadius; vertical <= MaskRadius; vertical++)
	{
		for (horizontal = -MaskRadius; horizontal <= MaskRadius; horizontal++)
		{
			maskx[vertical + centy][horizontal + centx] = ((horizontal / (sigma * sigma)) * exp(-1 * ((vertical * vertical) + (horizontal * horizontal)) / (2 * (sigma * sigma))));
			masky[vertical + centy][horizontal + centx] = ((vertical   / (sigma * sigma)) * exp(-1 * ((vertical * vertical) + (horizontal * horizontal)) / (2 * (sigma * sigma))));
		}
	}
}
// perform a single location convolution in the canny standard.
static void SingleLocationConvolution(register const int MaskRadius, register const int i, register const int j, register const int centx, register const int centy)
{
	register double sumx = 0;
	register double sumy = 0;
	register int vertical, horizontal;
	for (vertical = -MaskRadius; vertical <= MaskRadius; vertical++)
	{
		for (horizontal = -MaskRadius; horizontal <= MaskRadius; horizontal++)
		{
			sumx += pic[i + vertical][j + horizontal] * maskx[vertical + centy][horizontal + centx];
			sumy += pic[i + vertical][j + horizontal] * masky[vertical + centy][horizontal + centx];
		}
	}
	convx[i][j] = sumx;
	convy[i][j] = sumy;
}
// perform a Scanning convolution in the canny standard.
void ScanningConvolution(register const int MaskRadius, register const int InitialBoundary, register const int centx, register const int centy)
{
	register const int Boundary = InitialBoundary - MaskRadius;
	register int i, j;
	for (i = MaskRadius; i <= Boundary; i++)
	{
		for (j = MaskRadius; j <= Boundary; j++)
		{
			SingleLocationConvolution(MaskRadius, i, j, centx, centy);
		}
	}
}
// Maximum Magnitude from the convolution
double GetMaximumMagnitudeValue(register const int MaskRadius, register const int InitialBoundary)
{
	register double MaximumMagnitudeValue = 0;
	register const int Boundary = InitialBoundary - MaskRadius;
	register int i, j;
	for (i = MaskRadius; i < Boundary; i++)
	{
		for (j = MaskRadius; j < Boundary; j++)
		{
			ival[i][j] = sqrt((double)((convx[i][j] * convx[i][j]) + (convy[i][j] * convy[i][j])));

			if (ival[i][j] > MaximumMagnitudeValue)
			{
				MaximumMagnitudeValue = ival[i][j];
			}
		}
	}
	return MaximumMagnitudeValue;
}
// Helper that creates a file and gives it a proper pgm header.
FILE* print_pgmHeader(char* restrict fileOutNameString)
{
	FILE* outputFile = fopen(fileOutNameString, "wb");
	fprintf(outputFile, "P5\n256 256\n255\n");
	return outputFile;
};
// prints the magnitude file
void WriteMagfile(char* restrict FileName, register const double MaximumMagnitudeValue)
{
	FILE* outputFile = print_pgmHeader(FileName);

	register int i, j;

	for (i = 0; i < PICSIZE; i++)
	{
		for (j = 0; j < PICSIZE; j++)
		{

			fprintf(outputFile, "%c", (char)(int)((ival[i][j] / MaximumMagnitudeValue) * Whitening));
		}
	}
	fclose(outputFile);
	return;
}

// Parses through the the image making comparisons in the angle quadrants.
void DetectAndFlagEdges(register const int MaskRadius, register const int InitialBoundary)
{
	register int i, j;
	register const int Boundary = InitialBoundary - MaskRadius;
	register double slope;
	for (i = MaskRadius; i < Boundary; i++)
	{
		for (j = MaskRadius; j < Boundary; j++)
		{
			slope = convy[i][j] / ((convx[i][j] == 0.0) ? .00001 : convx[i][j]);

			if ((slope <= TAN_22_5) && (slope > -TAN_22_5))
			{
				if ((ival[i][j] > ival[i][j - 1]) && (ival[i][j] > ival[i][j + 1]))
				{
					edgeflag[i][j] = MARKED;
				}
			}
			else if ((slope <= TAN_67_5) && (slope > TAN_22_5))
			{
				if ((ival[i][j] > ival[i - 1][j - 1]) && (ival[i][j] > ival[i + 1][j + 1]))
				{
					edgeflag[i][j] = MARKED;
				}
			}
			else if ((slope <= -TAN_22_5) && (slope > -TAN_67_5))
			{
				if ((ival[i][j] > ival[i + 1][j - 1]) && (ival[i][j] > ival[i - 1][j + 1]))
				{
					edgeflag[i][j] = MARKED;
				}
			}
			else
			{
				if ((ival[i][j] > ival[i - 1][j]) && (ival[i][j] > ival[i + 1][j]))
				{
					edgeflag[i][j] = MARKED;
				}
			}
		}
	}
	return;
}
// prints out the peak/edge(whatever it's damn called).
void WritePeakFile(char* restrict FileName)
{
	FILE* outputFile = print_pgmHeader(FileName);
	register int i, j;
	for (i = 0; i < PICSIZE; i++)
	{
		for (j = 0; j < PICSIZE; j++)
		{
				fprintf(outputFile, "%c", (char)(int)edgeflag[i][j]);
		}
	}
	fclose(outputFile);
	return;
}

// Applies a histogram thresholding effect based on the mag and peak data.
void ApplyHistogramThresholding(const double percent, const double MaskRadius)
{
	register int i, j;
	register double areaSummation = 0;
	register const double limitCutOff = (percent) * (double)PICSIZE * (double)PICSIZE;

	for (i = 0; i < PICSIZE; i++)
	{
		for (j = 0; j < PICSIZE; j++)
		{
			histogram[(int)ival[i][j]]++;
		}
	}
	// This was awful to realize what was wrong.
	for (i = 255 - MaskRadius; i > MaskRadius; i--)
	{
		areaSummation = areaSummation + histogram[i];
		if (areaSummation > limitCutOff)
		{
			break;
		}
	}

	// If we are able...I see no reason why high and low need to be named hi and lo...
	register const double high = i;
	register const double low = .25 * high;


	for (i = 0; i < PICSIZE; i++)
	{
		for (j = 0; j < PICSIZE; j++)
		{
			final[i][j] = 0;
			if (edgeflag[i][j] == 255)
			{
				if (ival[i][j] > high)
				{
					final[i][j] = 255;
					edgeflag[i][j] = 0;
				}
				else if (ival[i][j] < low)
				{
					edgeflag[i][j] = 0;
					final[i][j] = 0;
				}
			}
		}
	}

	return;
}

// Further passes over the current final to clean up.
// Using the inefficient version to do so.
// The inefficient version however is still being optimized by my coding style.
void EdgeCleanUp()
{
	register int i, j;
	register int MoreToDo = 1;
	register int vertical, horizontal;
	while (MoreToDo == 1)
	{
		MoreToDo = 0;
		for (i = 0; i < PICSIZE; i++)
		{
			for (j = 0; j < PICSIZE; j++)
			{
				if (edgeflag[i][j] == 255)
				{
					for (vertical = -1; vertical <= 1; vertical++)
					{
						for (horizontal = -1; horizontal <= 1; horizontal++)
						{
							// supposed possible error here, testing yields nothing while IDE cries Bloody Mary.
							if (final[i + vertical][j + horizontal] == 255)
							{

								final[i][j] = 255;
								edgeflag[i][j] = 0;
								MoreToDo = 1;
							}
						}
					}
				}
			}
		}
	}
};

// prints the final file
void WriteFinalFile(char* restrict FileName)
{
	FILE* FinalFile = print_pgmHeader(FileName);
	register int i, j;
	for (i = 0; i < PICSIZE; i++)
		for (j = 0; j < PICSIZE; j++)
			fprintf(FinalFile, "%c", (char)((int)(final[i][j])));

	fclose(FinalFile);
	return;
};


// Main
int main(int argc, char ** argv)
{
	register double sigma;
	const int centx = (MAXMASK / 2);
	const int centy = (MAXMASK / 2);
	register double percent;

	if ((argc != 3 && argc != 4)					||
		ReadInputFile(argv[1]) != SAFE				||
		assertDouble(argv[2])  != SAFE				||
		argc == 4 && assertDouble(argv[3]) != SAFE	)
	{
		return usageWarning();
	}
	else
	{
		percent = atof(argv[2]);
		if (argc == 4)
		{
			sigma = atof(argv[3]);
		}
		else
		{
			sigma = 1.0;
		}

	}
	register const int MaskRadius = (int)(sigma * 3);

	MakeCannyDerivativeMask(MaskRadius, sigma, centx, centy);
	ScanningConvolution(MaskRadius, 255, centx, centy);

	const double MaximumMagnitudeValue = GetMaximumMagnitudeValue(MaskRadius, PICSIZE);
	WriteMagfile("cannymag.pgm", MaximumMagnitudeValue);
	DetectAndFlagEdges(MaskRadius, PICSIZE);
	WritePeakFile("cannypeaks.pgm");

	

	ApplyHistogramThresholding(percent, MaskRadius);

	

	EdgeCleanUp();
	
	WriteFinalFile("cannyfinal.pgm");

	return 0;
}