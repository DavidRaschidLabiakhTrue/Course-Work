/*=============================================================================
 |   Assignment:  Homework 3 - Build a hashing algorithm that is suitable for use in a Bloom Filter. 
 |
 |       Author:  David Raschid Labiakh-True
 |     Language:  Java
 |
 |   To Compile:  javac Hw03.java
 |
 |   To Execute:  java Hw03 filename
 |
 |        Class:  COP3503 - CS II Summer 2021
 |   Instructor:  McAlpin
 |     Due Date:  per assignment
 |
 +=============================================================================*/
 import java.io.File;
 import java.util.Scanner;
 public class Hw03
 {
    static final int randVal1 = 0xbcde98ef; // constant1
    static final int randVal2 = 0x7890face; // constant2
    public static void main(String[] args)
    {
        String getString;
        Scanner scanIn = null; // initialized explicitly for checking.
        complexityIndicator(); // Difficulty Check
        try { scanIn = new Scanner(new File(args[0])); } // Open File
        catch (Exception er)
        {
            if (scanIn != null) { scanIn.close();} // Catch bad file.
            return;
        }
        
        while(scanIn.hasNextLine())
        {
            getString = scanIn.nextLine();
            System.out.format("%10x:%s\n", UCFxram(getString, getString.length()), getString); // process and print
        }
        System.out.println("Input file processed");
       
        scanIn.close(); // Close scanner
        return; // Get ready for final.
    }
    static void complexityIndicator() { System.err.println("da248697;1.61;2.0"); }
    static int UCFxram(String d, int len)
    {
        int hashVal  = 0xfa01bc96; // hashVal
        int roundedEnd = len & 0xfffffffc; // rounded end
        int tempData; // temp val
        // Aggressively condensed algo.
        for (int i = 0; i < roundedEnd; i+=4)
        {
            tempData = ((d.charAt(i) & 0xff) | ((d.charAt(i+1) & 0xff) << 8) | (((d.charAt((i+2) & 0xff))) << 16) | ((d.charAt(i + 3)) << 24)) * randVal1;
            hashVal ^= (((tempData << 12) | (tempData >>> 20)) * randVal2);
            hashVal  = ((hashVal << 13) | (hashVal >>> 19)) * 5 + 0x46b6456e;
        }
        tempData = 0;
        if ((len & 0x03) == 3)
        {
            tempData = (d.charAt(roundedEnd + 2) & 0xff) << 16;
            --len;
        }
        if ((len & 0x03) == 2)
        {
            tempData |= (d.charAt(roundedEnd + 1) & 0xff) << 8;
            --len;
        }
        if ((len & 0x03) == 1)
        {
            tempData = (tempData | d.charAt(roundedEnd) & 0xff) * randVal1;
            hashVal ^=  ((tempData << 14) | (tempData >>> 18))  * randVal2;
        }
        hashVal = (hashVal ^ len) & 0xb6acbe58;
        hashVal = (hashVal ^ hashVal >>> 13) * 0x53ea2b2c;
        hashVal ^= hashVal >>> 16;
        return hashVal;
    }
 }
 /*=============================================================================
 |     I David Raschid Labiakh-True (4831599) affirm that this program is 
 | entirely my own work and that I have neither developed my code together with
 | any another person, nor copied any code from any other person, nor permitted
 | my code to be copied  or otherwise used by any other person, nor have I 
 | copied, modified, or otherwise used programs created by others. I acknowledge
 | that any violation of the above terms will be treated as academic dishonesty.
 +=============================================================================*/