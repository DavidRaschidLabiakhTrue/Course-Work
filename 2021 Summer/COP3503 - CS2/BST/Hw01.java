/*=============================================================================
 |   Assignment:  HW 01 - Building and managing a BST
 |
 |       Author:  David Raschid labiakh-True
 |     Language:  Java
 |
 |   To Compile:  javac Hw01.java
 |
 |   To Execute:  java Hw01 filename
 |                     where filename is in the current directory and contains
 |                           commands to insert, delete, print.
 |
 |        Class:  COP3503 - CS II Spring 2021
 |   Instructor:  McAlpin
 |     Due Date:  per assignment
 |
 +=============================================================================*/


 // basic file reading
import java.io.File;
// Homework 1 requirement
import java.util.ArrayList;
// basic file parser
import java.util.Scanner;
// Recursion is obviously designed to fail.
// These utils support iterative processes.
// They do not streamline management.
import java.util.Stack;
import java.util.LinkedList;
import java.util.Queue;

public class Hw01
{
    public static void main(String[] args)
    {
        Scanner scanFile;
        BST binarySearchTree;
        ArrayList<String[]> commandList;
        // If no file can be found in the commandline, exit.
        try
        {   scanFile = new Scanner(new File(args[0])); }
        catch (Exception er)
        {
            complexityIndicator();
            return; 
        }
        
        commandList = new ArrayList<String[]>();
        // Hit 2 birds with 1 stone. Break each entry into an array for linear parsing.
        // Wish to parse it directly with no array list but list required.
        while (scanFile.hasNextLine()) 
            commandList.add(scanFile.nextLine().split(" ")); 
        
        // Don't need file anymore.
        scanFile.close();
        // Print the contents. The arraylist makes this a simple to do.
        Hw01.printInputFile(commandList, args[0]);
        // Basic BST in memory now.
        binarySearchTree = new BST();
        // Parse the commands directly from the first string using an enhanced for loop.
        // Switch match it. if numeric parsing required, go to that case and try to parse.
        // Malformed statement get caught by the try blocks with parseInt().
        for (String commands[]: commandList)
        {
            switch(commands[0])
            {
                // Insert
                case "i":                   
                    try
                    { 
                        binarySearchTree.insertBSTNode(Integer.parseInt(commands[1])); 
                    }
                    catch (Exception er)
                    { dbg.dbgNumericParameter(commands[0]); }
                    break;

                // Delete    
                case "d":
                    try
                    {                   
                        binarySearchTree.deleteBSTNode(Integer.parseInt(commands[1]));
                    }
                    catch (Exception er)
                    { dbg.dbgNumericParameter(commands[0]); }
                    break;

                // Search
                case "s":
                    try
                    { 
                        binarySearchTree.searchBST(Integer.parseInt(commands[1]));
                    }
                    catch (Exception er)
                    { dbg.dbgNumericParameter(commands[0]); }
                    break;

                // Quit
                case "q":                    
                    binarySearchTree.printBSTStats();
                    complexityIndicator();
                    return;

                // Print
                case "p":                    
                    binarySearchTree.printBSTInOrder();
                    break;
                // malformed command recovery.
                default :
                    break;
            }
        }
        // Redundant technically. Silences java compiler but also acts in place of lack of q.
        binarySearchTree.printBSTStats();
        complexityIndicator();
        return;
    }
    // student info.
    static void complexityIndicator()
    {
        System.err.println("da248697;2.5;9");
    }
    // Simple printing System. 
    // Takes in the Arraylist slot which holds String Arrays and parses them by switch.
    // Reducable in memory size massively if using a custom class to hold by char and input string vs string string
    static void printInputFile(ArrayList<String[]> commandList, String inputFileName)
    {
        
        System.out.println(inputFileName + " contains:");
        for (String[] printCommands: commandList)
        {
            switch(printCommands[0])
            {
                case "i":
                case "d":
                case "s":
                    try
                    {
                        System.out.print(printCommands[0]);
                        // *assuming* if a lack of value is somehow found here, we also don't want the space printed
                        System.out.print(" " + printCommands[1]);
                        
                    }
                    catch (Exception er)
                    {
                        // null catcher in event of malformed command.
                    }
                    finally
                    {
                        // in event of malformed command
                        System.out.println();
                    }
                    break;
                default:
                    System.out.println(printCommands[0]);
                    break;
            }
        }
        return;
    }
}
// Node class that holds the slots for the BST.
// Feel as if there is a better way to do the BST instead of standard tree mechanics.
class node
{
    int data;
    node lNode;
    node rNode;
    node(int insertionData)
    {
        this.data = insertionData;
        this.lNode = null;
        this.rNode = null;
    }
}
// Binary Search Tree
class BST
{
    
    private node root;
    int lchildren;
    int rchildren;
    // Initiallizer assumes nothing about the tree wanted in this set up.
    BST()
    {   
        root = null;
        lchildren = rchildren = 0;   
     }

    // This is basically the gate call to check for null trees and auto insert at root
    // If it fails, insert using the helper.
    void insertBSTNode(int insertData)
    {
        if (this.root == null)
        {
            this.root = new node(insertData);
            return;
        }
        this.root = insertBSTNodeHelper(insertData);
    }
    // Iterative node insertion using BST mechanics
    private node insertBSTNodeHelper(int insertData)
    {
        // Start at the root
        node currentReference = this.root;
        // Use this node to track nodes previous of the current reference.
        node parentReference;
        // We can determine which side the child will be added too with a root inequality test.
        // This way, don't have to worry about performing a count later manually(strenuous to make I found)
        //char alignment = charDetermineInsertAlignment(this.root, insertData);
        
        // Iterative branch insert going left or right. Once we find null, target the parent's side and allocate.
        while (true)
        {
                parentReference = currentReference;
                // When null is found, insert data.
                if (insertData < currentReference.data)
                {
                    currentReference = currentReference.lNode;
                    if (currentReference == null)
                    {
                        parentReference.lNode = new node(insertData);
                        break;
                    }
                    
                    continue;   
                }
                if (insertData >= currentReference.data)
                {
                    currentReference = currentReference.rNode;
                    if (currentReference == null)
                    {
                        parentReference.rNode = new node(insertData);
                        break;
                    }
                    
                    continue;   
                }
        }    
    return this.root;    
    }

    void printBSTInOrder()
    {
        System.out.print(" ");
        Stack<node> printStack = new Stack<node>();
        node currentReference = this.root;

        while (currentReference != null || printStack.size() > 0)
        {
            while (currentReference != null)
            {
                printStack.push(currentReference);
                currentReference = currentReference.lNode;
            }
            currentReference = printStack.pop();
            System.out.print(currentReference.data);
            currentReference = currentReference.rNode;
            if (currentReference != null || printStack.size() > 0)
                System.out.print(" ");     
        }
        System.out.println();
    }
    // Stack method Counting.
    private int countInOrder(char countSide)
    {
        if (this.root == null)
            return 0;
        
        node operatorNode = (countSide == 'l') ? this.root.lNode : this.root.rNode;
        if (operatorNode == null)
            return 0;

        Stack<node> countStack = new Stack<node>();
        int count = 0;
        while (operatorNode != null || countStack.size() > 0)
        {
            while (operatorNode != null)
            {
                countStack.push(operatorNode);
                operatorNode = operatorNode.lNode;
            }
            operatorNode = countStack.pop();
            count++;
            operatorNode = operatorNode.rNode;
        }
        
        return count;
    }

    // Node Delete control func.
    void deleteBSTNode(int deleteData)
    {
        // null test.
        if (this.root == null)
        {
            dbg.commandNotice("d", deleteData);
            return;
        }
        // Actual deletion function.
        this.root = deleteBSTNodehelper(deleteData);
        return;
    }
    // Controls all deletion and cases iteratively.
    private node deleteBSTNodehelper(int deleteData)
    {
        node referenceNode = null;
        node parentNode = null;
        // Data container. Holds data because Java's pass system isn't consistent at times.
        referenceTuple assigner = null;
        // Basically tests for first root. Solves immediate edge cases.
        boolean firstRootFlag = (this.root.data == deleteData) ? true : false;
        
        // First node or tree must have the data else it's not here.
        if (firstRootFlag == false)
        {
            // Perform an iterative search
            assigner = deleteBSTSearch(referenceNode, parentNode, deleteData);
            if (assigner.status == false)
            {
                // The item is not in the tree.
                dbg.commandNotice("d", deleteData);
                return this.root;
            }
            // update the nodes
            referenceNode = assigner.currentRefTup;
            parentNode = assigner.parentRefTup;
        }
        else
            referenceNode = this.root;

        // For leaves and singular root nodes with no children
        if (referenceNode.lNode == null && referenceNode.rNode == null)
        {
            // leaf nodes must be treated differently.
            // Match the leaf to it's parent and remove it from the parent node.
            if (firstRootFlag == false)
            {
                if (parentNode.rNode == referenceNode)
                    parentNode.rNode = null;

                else if (parentNode.lNode == referenceNode)
                    parentNode.lNode = null;
  
                referenceNode = null;
                return this.root;
            }
            // This is the first and only node. Kill it off.
            else
            {
                this.root = null;
                return this.root;
            }
        }

        // The remaining cases are more nuanced in deleting so they are split into dispatch and search style methods.
        
        // Refer to a dispatch style method to choose how ot proceed with deletion based on 1 child and condition.
        if (referenceNode.lNode != null && referenceNode.rNode == null)
            return deleteDispatch('l', parentNode, referenceNode);
        // Refer to a dispatch style method to choose how ot proceed with deletion based on 1 child and condition.
        if (referenceNode.lNode == null && referenceNode.rNode != null)
            return deleteDispatch('r', parentNode, referenceNode);
        // Special deletion function to make choices based on deleting nodes with 2 children.
        if (referenceNode.lNode != null && referenceNode.rNode != null)
            return deleteWithTwoChild(parentNode, referenceNode, deleteData);

        return this.root;
    }
    // Iterative Search function. Uses a data container to hold results to return.
    private referenceTuple deleteBSTSearch(node referenceNode,  node parentNode, int deleteData)
    {
        referenceNode = this.root;
        // A way to pass information enmass beteween functions.
        referenceTuple assigner = new referenceTuple();
        // Search it like any other iterative BST search. Easy to implement and debug and moderatively fast to perform.
        while (referenceNode != null && referenceNode.data != deleteData)
        {  
            parentNode = referenceNode;
            if (referenceNode.data >= deleteData)
                referenceNode = referenceNode.lNode;

            else if (referenceNode.data < deleteData)
                referenceNode = referenceNode.rNode;    
        }
        if (referenceNode == null || referenceNode.data != deleteData)
        {
            assigner.status = false;
            assigner.currentRefTup = null;
            return assigner;
        }
        assigner.status = true;
        assigner.currentRefTup = referenceNode;
        assigner.parentRefTup = parentNode;
        return assigner;
    }
    // Choose what to do based off left or right alignment to fix node with 1 child.
    private node deleteDispatch(char chooseSide, node parentNode, node referenceNode)
    {
        // Root node edge case.
        if (parentNode == null)
        {
            // make a choice based off the side choen chosen.
            switch(chooseSide)
            {
                case 'l':
                    this.root = this.root.lNode;
                    return this.root;

                case 'r':
                    this.root = this.root.rNode;
                    return this.root;
            }
        }
        // Prefer to make it explicit via switch what is being done for people after me.
        switch(chooseSide)
        {
            case 'l':
                if (parentNode.rNode == referenceNode)
                    parentNode.rNode = referenceNode.lNode;

                else
                    parentNode.lNode = referenceNode.lNode;

                referenceNode = null;
                
                return this.root;

            case 'r':
                if (parentNode.rNode == referenceNode)
                    parentNode.rNode = referenceNode.rNode;

                else
                    parentNode.lNode = referenceNode.rNode;
                referenceNode = null;
                
                return this.root;

            default:
                return this.root;
        }
    }

    // Double Child resolution method.
    private node deleteWithTwoChild(node parentNode, node referenceNode, int deleteData)
    {
        // Operator Search nodes. This function basically looks for the left most node.
        // Then it take's the right most node of the left, 
        //basically injecting in order the largest node before the node we want deleted.
        node tempParentNode = null;
        node tempRefNode = referenceNode.rNode;
        // Search the left/
        while(tempRefNode.lNode != null)
        {
            tempParentNode = tempRefNode;
            tempRefNode = tempRefNode.lNode;
        }
        // Orphan the temp node and take it's right node.
        if (tempParentNode != null)
            tempParentNode.lNode = tempRefNode.rNode;
        else
            referenceNode.rNode = tempRefNode.rNode;
        // Take the data.
        referenceNode.data = tempRefNode.data;
        return this.root;
    }
    // Iterative search function. Simple inequality search system.
    public boolean searchBST(int findData)
    {
        node operatorNode = this.root;
        // Look for data by inequality.
        // if it's found or not found, note it with commandNotice()
        while (operatorNode != null)
        {
            if (findData > operatorNode.data)
                operatorNode = operatorNode.rNode;
            else if (findData < operatorNode.data)
                operatorNode = operatorNode.lNode;
            else if (findData == operatorNode.data)
            { 
                dbg.commandNotice("+", findData);
                return true;
            }
        }
        dbg.commandNotice("s", findData);
        return false;
    }
    // General call to print the stats.
    // Also calculates the stats in real time. Can be adapted to calculate as BST stats as well.
    void printBSTStats()
    {   
        correctorStringPrint("left children:", this.countInOrder('l'));
        correctorStringPrint("left depth:", treeDepth(this.root.lNode));
        correctorStringPrint("right children:", this.countInOrder('r'));
        correctorStringPrint("right depth:", treeDepth(this.root.rNode));
        return;
    }
    // Basically a function to print properly based on input and length due to print requirements
    private void correctorStringPrint(String input, int printArgument)
    {
        String spacer = " ";
        String argumentToString = Integer.toString(printArgument);
        System.out.print(input);
        System.out.print(spacer.repeat(25 - input.length() - argumentToString.length()));
        System.out.println(argumentToString);
        
        return;
    }
    // Tree Depth Calculation method.
    private int treeDepth(node countDepth)
    {
        Queue<node> depthQueue;
        node frontQueueNode = null;
        int queueSizeControl;
        int MaxDepth = 0;

        if (countDepth == null)
            return 0;
        if (countDepth.lNode == null && countDepth.rNode == null)
            return 1;
        // Track it List Style.
        // Start a queue
        depthQueue = new LinkedList<>();
        // Add the root.
        depthQueue.add(countDepth);

        while (!depthQueue.isEmpty())
        {
            queueSizeControl = depthQueue.size();
            // Read into the Queue. Acts more like an array heap if anything.
            // The while loop basically stops count once all levels have been passed through.
            while (queueSizeControl > 0)
            {
                queueSizeControl--;
                frontQueueNode = depthQueue.poll();
                if (frontQueueNode.lNode != null)
                    depthQueue.add(frontQueueNode.lNode);
                if (frontQueueNode.rNode != null)
                    depthQueue.add(frontQueueNode.rNode);
            }
            // This is updated as we pass through each level. 
            // Once we have no more levels to pass through, we are left with the max depth.
            MaxDepth++;
        }
        return MaxDepth;
    }
}
// Helper Data Container to pass address references between functions.
// More or less a Crutch for where java fails to be consistent with "pass by value"
class referenceTuple
{
    node currentRefTup;
    node parentRefTup;
    boolean status;
    referenceTuple()
    {
        currentRefTup = parentRefTup = null;
    }
}
// debug/print class to simplify debug and printing out messages
class dbg
{
    static void dbgNumericParameter(String commandArgument)
    {
        // Generic Error message parsing
        System.out.println("command-> " + commandArgument + " missing numeric parameter");
    }
    // Dispatch style switch to print information.
    static void commandNotice(String commandArgument, int commandValue)
    {
        switch(commandArgument)
        {
            case "+":
                System.out.println(commandValue + ": found");
                break;

            case "s":
                System.out.println(commandValue + ": NOT found");
                break;

            case "d":
                System.out.println(commandValue + ": NOT found - NOT deleted");
                break;
        }
        return;
    }
}
/*=============================================================================
 |     I David Raschid Labiakh-True (da248697) affirm that this program is
 | entirely my own work and that I have neither developed my code together with
 | any another person, nor copied any code from any other person, nor permitted
 | my code to be copied  or otherwise used by any other person, nor have I
 | copied, modified, or otherwise used programs created by others. I acknowledge
 | that any violation of the above terms will be treated as academic dishonesty.
 +=============================================================================*/