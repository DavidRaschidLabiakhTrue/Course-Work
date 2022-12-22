/*=============================================================================
 |       Author:  David Raschid Labiakh-True
 +=============================================================================*/

#include <iostream>
#include <cstdio>
#include <string>
#include <locale>
 
using namespace std;

// constants
#define bufferSize 512
#define lineLimiter 80

// Easier to read filetype naming schemas
typedef FILE* File_PTR;
typedef char Character_Array;

// Generic file file. Holds length and a 512 buffer(This code only allocates on stack)
class File_Control
{
    public:
        // This is using C FILE types because C++ file systems are poorly designed.
        File_PTR fileReference;
        // instantiated Length
        int messageLength;
        // Self explanatory. Not a string.
        Character_Array messageBuffer[bufferSize];
        File_Control()
        {
            messageLength = 0;
        }
        bool readStream(char *fileName)
        {
            char characterBuffer;
            // bad file
            if ((fileReference = fopen(fileName, "r")) == NULL)
            {  
                return false;
            }
            // Get char, check char, input char, continue.
            while ((characterBuffer = fgetc(fileReference)) != EOF && messageLength != bufferSize)
            {
                if (isalpha(characterBuffer))
                {
                    // C++ needs very explicit casts.
                    messageBuffer[messageLength] = (char)tolower(characterBuffer);
                    messageLength++;
                }
            }
            return true;
        }
        // Generic file closing method.
        void closeFile()
        {
            if (fileReference != NULL)
            {
                fclose(fileReference);
            }
        }
        // Print format that can be called with a const string argument.
        void printFormatter(const char* prelinePrint)
        {
            cout << prelinePrint;
            int index_i = 0;
            int lineLimit = 0;
            for (index_i = 0, lineLimit = 0; index_i < messageLength; index_i++)
            {
                cout << messageBuffer[index_i];
                lineLimit++;
                // 80 char width control
                if (lineLimit == lineLimiter)
                {   
                    cout << '\n';
                    lineLimit = 0;
                }
            }
            cout << "\n";
            return;   
        }
};
// Meant for holding and manipulating plain text inserted.
class Plain_Text: public File_Control
{
    public:
        bool makePlainText(char *fileName)
        {
            if (readStream(fileName) == false)
            { 
                return false;
            }
            // if message isn't at 512 yet, pad it with x.
            if (messageLength < bufferSize)
                bufferWithX();
            closeFile();
            return true;
        }
        void printPlainText()
        {
            printFormatter("Plaintext:\n\n");
            cout << "\n\n";
        }
    private:
        // Don't want this callable otherwise.
        void bufferWithX()
        {
            while(messageLength != bufferSize)
            {
                messageBuffer[messageLength] = 'x';
                messageLength++;
            }
        }
};
// Key Class. Less sophisticated.
class Key_Text: public File_Control
{
        public:
            bool makeKeyText(char *fileName)             
            {
                if (readStream(fileName) == false)
                    return false;
                closeFile();
                return true;
            }
            void printKey()
            {
                printFormatter("Vigenere Key:\n\n");
                cout << "\n\n";
            }
};
// Cipher Class. This controls making the cypher and printing.
class Cipher_Text: public File_Control
{
    public:
        void makeCipher(Key_Text key, Plain_Text text)
        {
            encrypt(key, text);
            printFormatter("Ciphertext:\n\n");   
            return;
        }
    private:
        // Shouldn't be able to randomly call encryption with this outline.
        void encrypt(Key_Text key, Plain_Text text)
        {
            int index_i = 0;
            char bufferCalc;
            // Tracks if we should reloop the key or not.
            int index_key = index_i;
            for (index_i; index_i < bufferSize; ++index_i)
            {
                // I was playing around with this to figure out a working formula.
                // I have no damn clue why this works but it does so I'm keeping it.
                bufferCalc = (char)(((text.messageBuffer[index_i] + key.messageBuffer[index_key] - 2*'a') % 26) + 'a');
                messageBuffer[index_i] = bufferCalc;
                
                if (++index_key  == key.messageLength)
                {
                    index_key = 0;
                }
            }
            messageLength = bufferSize;    
        }
};
int main(int arcg, char *fileNames[])
{
    // Instantiated. This doesn't need to be an allocation based assignment.
    Key_Text readKey;
    Plain_Text readText;
    Cipher_Text readCipher;
    // Formatting
    cout << "\n\n";
    // bad input.
    if (readKey.makeKeyText(fileNames[1]) == false)
        return 0;

    if (readText.makePlainText(fileNames[2]) == false)
        return 0;
    readKey.printKey();
    readText.printPlainText();
    // Doubles for a print job until further notice.
    readCipher.makeCipher(readKey, readText);
    
    return 0;
}
