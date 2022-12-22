/*=============================================================================
 |   Assignment:  HW 02 - Building and managing a Skiplist
 |
 |       Author:  David Raschid labiakh-True
 |     Language:  Java
 |
 |   To Compile:  javac Hw02.java
 |
 |   To Execute:  java Hw02 filename
 |                     where filename is in the current directory and contains
 |                           commands to insert, delete, print.
 |
 |        Class:  COP3503 - CS II Summer 2021
 |   Instructor:  McAlpin
 |     Due Date:  per assignment
 |
 +=============================================================================*/

 // File reading.
import java.io.File;

import java.util.Scanner;
import java.util.Random;
// Positive would be added if multi-threading were the goal.
enum Polarity      { Negative, Neutral}
enum SkipListRange { LessThan, GreaterThan, UnknownDetermination, EqualMatch, Impossible}

public class Hw02 
{
    public static void main(String[] args)
    {
        Scanner fileScanner;
        SkipList SkipListMaster;
        String[] argumentBuffer;
        complexityIndicator();
        try 
        {
            fileScanner = new Scanner(new File(args[0]));
            System.out.println("For the input file named " + args[0]);
            
            if (args.length >= 2 && args[1].length() == 1 && Character.toLowerCase(args[1].charAt(0)) == 'r')
            {
                Long CurrentTime = System.currentTimeMillis();
                SkipListMaster = new SkipList(CurrentTime);
                System.out.println("With the RNG seeded,");
            }
            else
            {
                SkipListMaster = new SkipList();
                System.out.println("With the RNG unseeded,");
            }
        }
        catch(Exception Er)
        {
            return;
        }
        while (fileScanner.hasNextLine())
        {
            try
            {
                argumentBuffer = fileScanner.nextLine().split(" ");
                switch(argumentBuffer[0].charAt(0))
                {
                    case 'i':
                        SkipListMaster.Insert(Integer.parseInt(argumentBuffer[1]));
                        break;
                    case 'd':
                        SkipListMaster.delete(Integer.parseInt(argumentBuffer[1]));
                        break;
                    case 's':
                        SkipListMaster.search(Integer.parseInt(argumentBuffer[1]), 's');
                        break;
                    case 'p':
                        SkipListMaster.printAll();
                        break;
                    case 'q':
                        fileScanner.close();
                        return;
                }
            }
            catch (Exception er)
            {
                continue;
            }
        }
        fileScanner.close();
        return;
    }
    static void complexityIndicator()
    {
        System.err.println("da248696;3.5;22.1");
    }
}
// data node both negative and neutral can share.
abstract class DataNode
{
    abstract Polarity PolarSide();
}
// Holds high way nodes. Grid like Highway structure
class SkipListNode extends DataNode 
{
    int data;
    // The left can be negative or neutral.
    DataNode left;
    // Positive was omitted because no permission to multi-thread.
    SkipListNode right;
    SkipListNode up;
    SkipListNode down;
    SkipListNode()
    {
        // Silences Shitty Compilers
    }
    // List Constructor
    // This call forms nodes on the bottom of the Skip List.
    // It also handles linking up everything.
    SkipListNode(DataNode leftNode , int insertData, SkipListNode rightNode)
    {
        this.data = insertData;
        if (leftNode.PolarSide() == Polarity.Negative) 
            ((NegativeSentinel)leftNode).right = this;
        else 
            ((SkipListNode)leftNode).right = this;
        this.left = leftNode;
        if (rightNode != null)
            rightNode.left = this;
        this.right = rightNode;
        this.up = null;
        this.down = null;
    }
    // Highway Constructor.
    // This constructor handles highway construction and links up everything internally
    SkipListNode(DataNode leftNode, SkipListNode constructHighway, SkipListNode rightNode)
    {
        this.data = constructHighway.data;
        if (leftNode.PolarSide() == Polarity.Negative) 
            ((NegativeSentinel)leftNode).right = this;
        else 
            ((SkipListNode)leftNode).right = this;
        this.left = leftNode;
        constructHighway.up = this;
        this.down = constructHighway;
        if (rightNode != null)
            rightNode.left = this;
        this.right = rightNode;
    }
    // More or less a Dummy function.
    // it's real utility is implemented in NegativeSentinel
    public Polarity PolarSide(){return Polarity.Neutral;}
}
// The NegativeSentinel doesn't act so much like a way to say postive and negative. 
// Instead, it functions as a starting point and guide railing for the SkipList Here.
class NegativeSentinel extends DataNode
{
    // Up and Down are always NegativeSentinels or Null. Nothing Else.
    NegativeSentinel up;
    NegativeSentinel down;
    // The right is always a SkipList Node or Null. Nothing Else.
    SkipListNode right;
    // Raw construction initialization. 
    // Only gets called once.
    NegativeSentinel()
    {
        this.up = this.down = null;
        this.right = null;
    }
    // Build Constructor. Builds the Negative tower upwards, performing automatic linking.
    NegativeSentinel(NegativeSentinel formerNode)
    {
        formerNode.up = this;
        this.up = null;
        this.right = null;
        this.down = formerNode;
    }
    // Designation Function.
    // Casting a NegativeSentinel as a Skiplist Node when traversing is an exception.
    // This function exists to mitigate primary issues
    // Do not have to make the Head tower Null.
    // Can safetly check the left node for Negative if need be.
    // Can avoid lengthy instanceof checking.
    // Can hold it's type desiginator without holding it's type desiginator with the NegativeSentinel itself.
    public Polarity PolarSide() {return Polarity.Negative;}
}
// The Actual Skip List Class
class SkipList
{
    // This variable tells us the current height of the SkipList.
    // The Rule I set is, the List is at Height 0. The Start node is at +1 of the tallest highway's height afterwards.
    int maxHeight;
    // Hold the start of the Skip List from the top.
    NegativeSentinel start;
    // This node is the *head* of the bottom list. The right node of this *is the minimum node* .
    NegativeSentinel bottomStart;
    // This node *is the max*/tail.
    // Approaching this node signals we need to stop in some cases.
    SkipListNode stop;
    // Random Number generator for promotion.
    Random RNG;
    // Stock RNG genreation
    SkipList(){ this(42);}
    // Basic Initialization
    SkipList(long startRand)
    {
        this.RNG = new Random(startRand);
        this.maxHeight = 1;
        this.bottomStart = new NegativeSentinel();
        this.start = new NegativeSentinel(this.bottomStart);
        this.stop = null;
    }
    // Insertion Function
    SkipListNode Insert(int insertData)
    {
        SkipListNode insertOperator = null;
        int timesToDuplicate = 0;
        // safety check
        if (this.stop == null)
            this.bottomStart.right = this.stop = insertOperator = new SkipListNode(this.bottomStart, insertData, null);
        else
            insertOperator = limitDispatch(rangeTest(insertData), insertData);
        // Duplicate entry.
        if (insertOperator == null)
            return null;
        // Count the number of times to promote and loop promote it.
        timesToDuplicate = countPromotions();
        // Check the number of times we need to duplicate against the height of the skip list before hand.
        // if it's greater, grow the NegativeSentinel Railing.
        if (this.maxHeight < timesToDuplicate)
            updateTopNegative(timesToDuplicate);
        // Begin to Duplicate.
        promote(insertOperator, timesToDuplicate);
        return insertOperator;
    }
    // This function duplicates a node to create highways for search traversal.
    SkipListNode promote(SkipListNode baseNode, int timesToDuplicate)
    {
        SkipListNode promotionOperator = baseNode;
        SkipListNode baseReferenceNode = baseNode;
        NegativeSentinel levelTracker = this.bottomStart;
        int index_promotion;

        if (timesToDuplicate == 0)  
            return baseNode;
        
        // Triangular insertion
        for (index_promotion = 0; index_promotion < timesToDuplicate; index_promotion++)
        {
            // go left and look up until first valid.
            promotionOperator = rewindLookUp(promotionOperator);
            // Keep the tracker up 1 always.
            levelTracker = levelTracker.up;
            // if this is not null, we were returned a node where we can insert at right wards
            if (promotionOperator != null)
            {
                baseReferenceNode = new SkipListNode(promotionOperator, baseReferenceNode, promotionOperator.right);
                promotionOperator = baseReferenceNode;
                continue;
            }
            if (promotionOperator == null)
            {
                // if it's null, for whatever reason, the next up insert has to start from the beginning of the next line upwards
                baseReferenceNode = new SkipListNode(levelTracker, baseReferenceNode, levelTracker.right);
                promotionOperator = baseReferenceNode;
                continue;
            }
        }
        return promotionOperator;
    }
    // Iterative line traversal
    private SkipListNode rewindLookUp(SkipListNode startSearch)
    {
        // being left ensures inequality being met.
        SkipListNode lineLookUp = startSearch;
        while(lineLookUp.left.PolarSide() != Polarity.Negative)
        {
            if (((SkipListNode)lineLookUp.left).up == null)
            {
                lineLookUp = ((SkipListNode)lineLookUp.left);
                continue;
            }
            else
                return ((SkipListNode)lineLookUp.left).up;
        }
        //  no valid position to advance up from a node
        // this still doesn't happen none on left and something on the right.
        if (lineLookUp.left.PolarSide() == Polarity.Negative && (lineLookUp.up == null || lineLookUp == startSearch))
            return null;
        return lineLookUp;
    }
    // dispatches a node after evaluating input
    private SkipListNode limitDispatch(SkipListRange limitTest, int dataCMP)
    {
        SkipListNode dispatchOperator = null;
        switch(limitTest)
        {
            case LessThan:
                // less than lowest
                dispatchOperator = this.bottomStart.right = new SkipListNode(this.bottomStart, dataCMP, this.bottomStart.right);
                break;
            case GreaterThan:
                // greater tthan greatest
                dispatchOperator = this.stop = new SkipListNode(this.stop, dataCMP, null);
                break;
            case Impossible:
            case EqualMatch:
                // Duplicate/or impossible(null SkipList)
                dispatchOperator = null;
                break;
            case UnknownDetermination:
                // Not on the outskirts of the limits
                dispatchOperator = searchInsert(dataCMP);
                // Safety Test.
                if (dispatchOperator != null && dispatchOperator.data != dataCMP &&  dispatchOperator.right.data != dataCMP)
                {
                    dispatchOperator = new SkipListNode(dispatchOperator, dataCMP, dispatchOperator.right);
                    break;
                }
                dispatchOperator = null;
                break;
        }
        return dispatchOperator;
    }
    private int countPromotions()
    {
        int promotionCount = 0;
        while ( (Math.abs(RNG.nextInt()) % 2) == 1)
            ++promotionCount;        
        return promotionCount;
    }
    // Checks the sides to perform an optimizing skip test.
    private SkipListRange rangeTest(int insertData)
    {
        if (this.bottomStart.right == null)
            return SkipListRange.Impossible;
        if (insertData == this.bottomStart.right.data || insertData == this.stop.data)
            return SkipListRange.EqualMatch;
        if (insertData > this.bottomStart.right.data && insertData < this.stop.data)
            return SkipListRange.UnknownDetermination; 
        return (insertData > this.stop.data) ? SkipListRange.GreaterThan: SkipListRange.LessThan;
    }

    // searches for insert spots
    // This is functionally very similar to general search. It's made seperate instead of generic because it runs on different criteria
    private SkipListNode searchInsert(int dataCMP)
    {
        
        NegativeSentinel levelOperator = this.start;
        SkipListNode searchOperator = levelOperator.right;
        // look for first *valid node* to begin a search
        // if equal found, return null to signal duplicate
        searchOperator = findFirstNode(dataCMP, false);
        // Equal means duplicate
        if (searchOperator.data == dataCMP)
            return null;
        
        // Edge case in event looking for the first valid node yields effectively a linked list search.
        if (searchOperator.down == null)
            return forwardListCMP(searchOperator, dataCMP, false);
        
        // keep stepping down.
        while (searchOperator.down != null)
        {
            searchOperator = searchOperator.down;
            // perform a forward list search until criteria is met.
            if(searchOperator.right != null && searchOperator.right.data < dataCMP)
            {
                searchOperator = forwardListCMP(searchOperator, dataCMP, false);
                // duplicate found.
                if (searchOperator == null)
                    return null;
                
            }
        }
        return searchOperator;
    }
    // Queries for valid level to begin search.
    private SkipListNode findFirstNode(int dataCMP, boolean shouldDispatch)
    {
        NegativeSentinel negativeOperator = this.start;
        SkipListNode searchOperator = negativeOperator.right;
        while (negativeOperator != null)
        {
            if (searchOperator == null || searchOperator.data > dataCMP)
            {
                // take a step down and right and check again
                negativeOperator = negativeOperator.down;
                searchOperator = negativeOperator.right;
                continue;
            }
            while(searchOperator.data < dataCMP)
            {
                if (searchOperator.right != null && searchOperator.right.data < dataCMP)
                    searchOperator = searchOperator.right;
                else
                    return searchOperator; 
            }
            if (searchOperator.data == dataCMP)
                return equalityDispatch( searchOperator, shouldDispatch);
        }
        return searchOperator;
    }
    SkipListNode equalityDispatch(SkipListNode nodeOfChoice , Boolean shouldDispatch)
    {
        if (shouldDispatch == false)
            return null;
        return nodeOfChoice;
    }
    // Forward linear Search
    // edge Insertion removes need to check for null
    // Slight bit of a condition mess.
    private SkipListNode forwardListCMP(SkipListNode searchOperator, int dataCMP, boolean shouldDispatch)
    {
        while (searchOperator.right != null && searchOperator.right.data < dataCMP)
            searchOperator = searchOperator.right;
        // Equal found, return a choice.
        if (searchOperator.data == dataCMP)
            return equalityDispatch(searchOperator, shouldDispatch);
        // sub routine for checking for with normal search
        // These are evaluated upon return.
        if (shouldDispatch == true)
        {
            if (searchOperator.data == dataCMP)
                return null;
            // Explicit Check for *not here*
            if (searchOperator.right == null)
                return searchOperator;
            if (searchOperator.right.data > dataCMP)
                return searchOperator;
            if (searchOperator.right.data == dataCMP)
                return searchOperator.right;   
        }
        // Insertion Safety Testing.
        if (searchOperator != null && searchOperator.data == dataCMP)
            return null;
        if (searchOperator.right != null && searchOperator.right.data == dataCMP)
            return null;
        return searchOperator;
    }
    // Grows the top up to a limit instead of actively growing it.
    private void updateTopNegative(int timesToUpdate)
    {
        int timesToGrow = timesToUpdate - this.maxHeight;
        int index_i;
        NegativeSentinel growTop = this.start;
        for (index_i = 0; index_i < timesToGrow; index_i++)
        {
            growTop = this.start = new NegativeSentinel(growTop);
        }
        growTop = this.start = new NegativeSentinel(growTop);
        this.maxHeight = timesToUpdate + 1;
    }
    // An unstated effect of this code is that it will manage the head and tail nodes of the SkipList at the lower level automatically.
    // This is because it does deletions by excising nodes in a line.
    void delete(int deleteData)
    {
        
        SkipListNode deletionOperator;
        SkipListRange checkRange = rangeTest(deleteData);
        // If it's not in range to delete, it's not there.
        if (checkRange != SkipListRange.EqualMatch && checkRange != SkipListRange.UnknownDetermination)
        {
            printSuccessFailure(false, deleteData, 'd');
            return;
        }
        // Find first valid to find
        deletionOperator = findFirstNode(deleteData, true);
        // finish it quickly.
        if (deletionOperator.data == deleteData)
        {
            deleteRoutine(deletionOperator);
            printSuccessFailure(true, deleteData, 'd');
        }
        else
        {
            // Begin searching.
            deletionOperator = search(deleteData, 'd');
            if (deletionOperator == null)
            {
                // Not here.
                return;
            }
            else
            {
                // if we find it, delete it via excision.
                if (deletionOperator.data == deleteData)
                    deleteRoutine(deletionOperator);
            }
        }
        // Clean up Routine.
        // Checks to see if we should update the top to clean up.
        if (this.start.down != this.bottomStart && this.start.down.right == null)
        {
            negativeCleanUp();
        }
        return;
    }
    // Dynamic clean up after deletion occurs. Don't want the height of the SkipList artificially inflating search time/memory.
    private void negativeCleanUp()
    {
        NegativeSentinel negativeOperator = this.start;
        if (negativeOperator.down.right == null && negativeOperator.down != this.bottomStart)
        {
            negativeOperator = negativeOperator.down;
            while(negativeOperator.right == null && negativeOperator.down != this.bottomStart)
            {
                negativeOperator.up.down = negativeOperator.down;
                negativeOperator.down.up = negativeOperator.up;
                negativeOperator = negativeOperator.down;
                this.maxHeight--;
            }
        }
    }
    // This is an upward and downward delete.
    // If a node is intercepted midway or makes it to the bottom, it will trigger a "slice" deletion.
    private void deleteRoutine(SkipListNode deleteLine)
    {
        
        SkipListNode downReference = deleteLine.down;
        SkipListNode upReference = deleteLine.up;
        
        while(downReference != null)
        {
            downReference = patchDeleteNode(false, downReference);
        }
        while(upReference != null)
        {
            upReference = patchDeleteNode(true, upReference);
        }
        // reference safety
        deleteLine.up = null;
        // delete the starting node.
        patchDeleteNode(true, deleteLine);
        return;
    }
    // Fuses the left and right node to each other and islanding itself for the java GC.
    private SkipListNode patchDeleteNode(boolean goUp, SkipListNode here)
    {
        // choose direction
        SkipListNode returnSpot = (goUp) ? here.up:here.down;
        if (here.right != null)
        {
            if (here.left.PolarSide() != Polarity.Negative)
            {
                ((SkipListNode)here.left).right = here.right;
            }
            else
            {
                ((NegativeSentinel)here.left).right = here.right;
            }
            here.right.left = here.left;
            return returnSpot;
        }
        // basically omitting a step
        if (here.left.PolarSide() != Polarity.Negative)
        {
            ((SkipListNode)here.left).right = here.right;
        }
        else
        {
            ((NegativeSentinel)here.left).right = here.right;
        }
        return returnSpot;
    }
    // unlike searchInsert which is specialized to *skip* and augment steps for performance to key points 
    // Search is just a search function. It looks for a node. It doesn't matter if it finds it on the lowest level or highest level.
    // It only wants proof and first proof alone.
    SkipListNode search(int findData, char searchMode)
    {
        SkipListRange checkRange = rangeTest(findData);
        SkipListNode searchOperator = null;
        // The Skip list is ordered. If the node searched is not in range, it's not here.
        if (checkRange != SkipListRange.EqualMatch && checkRange != SkipListRange.UnknownDetermination)
        {
            return null;
        }
        if (checkRange == SkipListRange.EqualMatch)
        {
            // in the event of data being on the ends, this is an O(1) search regardless of height.
            printSuccessFailure(true, findData, searchMode);
            return (this.stop.data == findData) ? (this.stop) : this.bottomStart.right;
        }

        // Find first valid node to begin searching.
        searchOperator = findFirstNode(findData, true);
        if (searchOperator.data == findData)
        {
            printSuccessFailure(true, findData, searchMode);
            return searchOperator;
        }
        // begin the step down triangle traversal
        while (searchOperator.down != null)
        {
            searchOperator = forwardListCMP(searchOperator, findData, true);
            
            if (searchOperator != null)
            {
                if (searchOperator.data == findData)
                {
                    printSuccessFailure(true, findData, searchMode);
                    return searchOperator;
                }
                if (searchOperator.data < findData)
                {
                    searchOperator = searchOperator.down;
                    continue;
                }
            }
        }
        // The search Operator once it's on the lowest level defaults to a linear search.
        searchOperator = forwardListCMP(searchOperator, findData, true);
        // failure
        if (searchOperator == null || searchOperator.data != findData)
        {
            printSuccessFailure(false, findData, searchMode);
            return searchOperator;
        }
        printSuccessFailure(true, findData, searchMode);
        return searchOperator;
    }
    private void printSuccessFailure(boolean success, int targetNode, char methodType)
    {
        if (success)
        {
            switch(methodType)
            {
                case 'd':
                    System.out.println(targetNode + " deleted");
                    break;
                case 's':
                    System.out.println(targetNode + " found");
                    break;
            }
        }
        else
        {
            switch(methodType)
            {
                case 'd':
                    System.out.println(targetNode + " integer not found - delete not successful");
                    break;
                case 's':
                    System.out.println(targetNode + " NOT FOUND");
                    break;
            }
        }
        return;
    }
    // Skip List's Print Function.
    void printAll()
    {
        System.out.println("the current Skip List is shown below:" + " " + "\n---infinity");
        SkipListNode operatorNode = this.bottomStart.right;
        while (operatorNode != null)
        {
            printLine(operatorNode);
            operatorNode = operatorNode.right;
        }
        System.out.println("+++infinity\n---End of Skip List---");
        return;
    }
    // Format the String to repeat and keep printing it until null is found.
    private void printLine(SkipListNode operatorNode)
    {
        if (operatorNode == null)
            return;
        // Formatting is now entirely removed due to new test cases.
        String repeatString = " " + Integer.toString(operatorNode.data) + "; ";
        // repeat it
        while (operatorNode != null)
        {
            System.out.print(repeatString);
            operatorNode = operatorNode.up;
        }
        // pop new line
        System.out.println();
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
