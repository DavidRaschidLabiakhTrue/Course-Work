
import java.util.Scanner;

public class Project1 {
	
	public static final double DISCOUNT_FOR_GOOD_STUDENTS = .25;
	public static final int STUDENT_FEE                   = 52;
	public static final double TUITION_RATE               = 236.45;
	

	public static void main(String[] args) 
    {	

		Scanner userInput          = new Scanner(System.in);
		StudentInfo studentOne     = new StudentInfo();
		StudentInfo studentTwo     = new StudentInfo();
		ProfessorInfo professorOne = new ProfessorInfo();
		

		int choice;

		int exit=0;

		while (exit != 1)
		{	
			printMessage();
			choice=getChoice(userInput);

			switch(choice)
			{
				case 0:
					System.out.println("\nInvalid entry- please try again\n");
					break;
				case 1:
					fillProfessorInfo(userInput, professorOne);
					break;
				case 2:
					getStudentInfo(userInput, studentOne, studentTwo);
					break;
				case 3:
					printTuition(userInput, studentOne, studentTwo);
					break;
				case 4:
					displayProfessorInfo(professorOne);
					break;
				case 5:
					System.out.print("Goodbye!");
					exit = 1;
					break;
				default:
					System.out.println("debugging");
					break;
			}
		}
	}
	

	public static void printMessage()	
	{
		System.out.println("1- Enter the information of the faculty ");
		System.out.println("2- Enter the information of the two students ");
		System.out.println("3- Print tuition invoice ");
		System.out.println("4- Print faculty information ");
		System.out.println("5- Exit Program \n");
	} 
	

	public static int getChoice(Scanner userInput)
	{

		char holdChar;
		String holdString;
		System.out.print("      Enter your Selection: ");
		holdString = userInput.nextLine();

		if(holdString.length() > 1 || holdString.length() == 0)
		{	return 0;                                         }

		holdChar = holdString.charAt(0);

		if(holdChar < '1' || holdChar > '5')
		{	return 0;					   }

		return Integer.valueOf(holdString);
			
	}
	

	public static void fillProfessorInfo(Scanner userInput, ProfessorInfo professorOne)
	{

		String holdString;
		System.out.println("\nEnter faculty info:");

		System.out.print("		Name of the faculty:  ");
		holdString = userInput.nextLine();
		professorOne.professorName = holdString;

		System.out.print("		ID:   ");
		holdString = userInput.nextLine();
		professorOne.professorID = holdString;

		System.out.print("		Rank: ");
		professorOne.rank       = checkProfessorRank(userInput);
		System.out.print("		Department: ");
		professorOne.department = checkProfessorDepartment(userInput);
		System.out.println("Thanks!\n");
	}
	

	public static String checkProfessorRank(Scanner userInput)
	{

		int signalError = 0;
		String holdString;
		holdString = userInput.nextLine();

		signalError = verifyProfessorRank(userInput, holdString);

		if(signalError == 1)
		{	while(signalError != 0)
			{
				System.out.println("Sorry entered rank ("  + holdString + ") is invalid" );
				System.out.print("		Rank: ");
				holdString = userInput.nextLine();
				signalError = verifyProfessorRank(userInput, holdString);
			}
		}

		holdString.toLowerCase();
		holdString = holdString.substring(0, 1).toUpperCase() + holdString.substring(1);
		return holdString;
	}
	
	public static int verifyProfessorRank(Scanner userInput, String holdString)
	{
		if (holdString.equalsIgnoreCase("professor") == false && holdString.equalsIgnoreCase("adjunct") == false )
		{	return 1;																							 }
		
		for(char c : holdString.toCharArray())
		{
			if(Character.isWhitespace(c) == true)
			{	return 1;				}
		}
		return 0;
	}
	

	public static String checkProfessorDepartment(Scanner userInput)
	{
		int signalError=0;
		String holdString;
		holdString  = userInput.nextLine();
		signalError = verifyProfessorDepartment(userInput, holdString);
		if(signalError == 1)
		{	
			while(signalError != 0)
			{
				System.out.println("Sorry entered department ("  + holdString + ") is invalid." );
				System.out.print("		Department: ");
				holdString  = userInput.nextLine();
				signalError = verifyProfessorDepartment(userInput, holdString);
			}
		}
		holdString.toLowerCase();
		holdString = holdString.substring(0, 1).toUpperCase() + holdString.substring(1);
		return holdString;
	}
	

	public static int verifyProfessorDepartment(Scanner userInput, String holdString)
	{
		if (holdString.equalsIgnoreCase("mathematics") == false && 
			holdString.equalsIgnoreCase("engineering") == false &&
			holdString.equalsIgnoreCase("arts") 	   == false &&
			holdString.equalsIgnoreCase("science")     == false   )
		   {	return 1;                                         }
		for (char c : holdString.toCharArray())
		{	
			if (Character.isWhitespace(c))
			{	return 1;				 }
		}
		return 0;
	}

	public static void displayProfessorInfo(ProfessorInfo professorOne)
	{
		if (professorOne == null || professorOne.professorName == null)
		{	
			System.out.println("\n      No faculty information found\n");
			return;
		}
		System.out.println("--------------------------------------------------------------------------");
		System.out.println(professorOne.professorName);
		System.out.println(professorOne.department + " " + "Department, " + professorOne.rank);
		System.out.println("--------------------------------------------------------------------------");
		return;
	}
	

	public static void getStudentInfo(Scanner userInput, StudentInfo studentOne, StudentInfo studentTwo)
	{	
		String holdString;

		if (studentOne.studentName != null ||
			studentTwo.studentName != null   )
		{
			System.out.println("      You already have two students filled in. Do you want to update their information?");
			System.out.print("Yes or No: ");
			holdString = userInput.nextLine();
			if (holdString.equalsIgnoreCase("no") == false)
			{	return;									  }
		}
		fillStudentInfo(userInput, studentOne, 1);
		fillStudentInfo(userInput, studentTwo, 2);
		return;
	}
	
	public static void fillStudentInfo(Scanner userInput, StudentInfo studentFill, int studentselection)
	{	
		String holdString;
		System.out.println("      Enter student " + studentselection + " info:");
		System.out.print("\n		Name of Student: ");
		holdString = userInput.nextLine();
		studentFill.studentName = holdString;
		System.out.print("		ID:   ");
		holdString = userInput.nextLine();
		studentFill.studentID = holdString;
		System.out.print("		Gpa:   ");
		holdString = userInput.nextLine();
		studentFill.studentGPA = Double.valueOf(holdString);		
		System.out.print("		Credit hours: ");		
		holdString = userInput.nextLine();
		studentFill.creditHours = Integer.valueOf(holdString);
		System.out.println("Thanks!\n");
	}
	

	public static void printTuition(Scanner userInput, StudentInfo studentOne, StudentInfo studentTwo)
	{
		int holdInt;
		if (studentOne.studentName == null ||
			studentTwo.studentName == null   )
		{	System.out.println("      No avaiable students to print tuition invoice\n");
			return;
		}
		System.out.print("Which student? 1 " + studentOne.studentName + " or 2 " + studentTwo.studentName + " ?");
		holdInt = Integer.valueOf(userInput.nextLine());
		if(holdInt != 1 || holdInt != 2)
		{
			System.out.println("Invalid Selection, returning to main menu\n");
		}
		if (holdInt == 1)
		{	
			printSelectedStudentTuition(studentOne); 
			return;
		}
		if(holdInt == 2)
		{
			printSelectedStudentTuition(studentTwo); 
			return;
		}
		
	}
	

	public static void printSelectedStudentTuition(StudentInfo selection)
	{
		String holdTotal;
		String holdDiscount;
		double total         = 0;
		double totalDiscount = 0;
		System.out.println("\n------------------------------------------------------------------------------------------");
		System.out.println(selection.studentName + "				" + selection.studentID);
		System.out.println("Credit Hours:" + selection.creditHours + " (" + TUITION_RATE + "/credit hour)" );
		System.out.println("Fees: $" + STUDENT_FEE);
		total = TUITION_RATE * selection.creditHours + STUDENT_FEE;
		
		if (selection.studentGPA >= 3.85)
		{
			totalDiscount = total * DISCOUNT_FOR_GOOD_STUDENTS;
			total = total - totalDiscount;
		}

		holdTotal = String.format("%,.2f", total);
		holdDiscount = String.format("%,.2f", totalDiscount);
		
		System.out.println("Total payment: $" + holdTotal + "                                ($" + holdDiscount + " discount applied)");
		System.out.println("------------------------------------------------------------------------------------------\n");
		return;
	}
	
	
}


class StudentInfo
{
	 String studentName;
	 String studentID;
	 double studentGPA;
	 int creditHours;
}


class ProfessorInfo
{
	String professorName;
	String professorID;
	String rank;
	String department;
}
