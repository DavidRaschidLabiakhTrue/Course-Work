
import java.util.Scanner;
import java.util.ArrayList;

public class FallJavaProject2rework 
{
	public static void main(String[] args) 
    {
		Scanner userInput            = new Scanner(System.in);
		ArrayList<Person> PersonList = new ArrayList<Person>();
		SelectionSystem operator     = new SelectionSystem();
		int exit = 0;
		char userChoice;
		System.out.println("\t\t\t\t\t\tWelcome to my Personal Management Program");
		while (exit != 1)
		{		
				operator.printOptions();
				userChoice = operator.getOption(userInput);
				switch(userChoice)
				{
					case '1':
						PersonList.add(Faculty.assembleFaculty(PersonList, userInput));
						break;
					case '2':
						PersonList.add(Student.assembleStudent(PersonList, userInput));
						break;
					case '3':
						Student.generateTuitionInvoice(PersonList, userInput);
						break;
					case '4':
						Faculty.generateFacultyInfo(PersonList, userInput);
						break;
					case '5':
						System.out.print("\n\tGoodbye!");
						exit = 1;
						break;
					case '6':
						System.out.println("Invalid entry- please try again");
						break;
					default:
						System.out.println("Critical Error, terminating program");
						exit = 1;
				}
		}
		return;
    }
}
class SelectionSystem
{
	private char choice;
	
	public SelectionSystem()
	{
		this.choice = ' ';
	}
	public SelectionSystem (char input)
	{
		this.choice = input;
	}
	public char getChoice(Scanner userInput)
	{
		return this.choice;
	}

	public void printOptions()
	{
		System.out.println("\nChoose one of the options:\n");
		System.out.println("1- Add a new Faculty Member");
		System.out.println("2- Add a new Student");
		System.out.println("3- Print tuition invoice for a student");
		System.out.println("4- Print information of a faculty");
		System.out.println("5- Exit Program\n");
		System.out.print("\tEnter your selection: ");
	}

	public char getOption(Scanner userInput)
	{
		String holdString = userInput.nextLine();
		char selection;
		if(holdString.length() > 1 || holdString.length() == 0)
		{	return '6';                                         }
		selection = holdString.charAt(0);
		if(selection < '1' || selection > '5')
		{	return '6';					   }
		return selection;
	}
}

abstract class Person
{
	private String Name;
	private String ID;

	public Person()
	{
		this.Name = null;
		this.ID   = null;
	}

	public void initializePerson()
	{
		this.Name = null;
		this.ID   = null;
	}

	public void setName(String setNameString)
	{	this.Name = setNameString;}

	public void setID(ArrayList<Person> PersonList, Scanner userInput)
	{	this.ID = Person.testID(PersonList, userInput);}
	public static String testID(ArrayList<Person> PersonList, Scanner userInput)
	{
		int exit = 0;
		String inputString = null;
		String compareStrings = null;
		int arraySize = PersonList.size();
		int index;
		while (exit != 1)
		{
			System.out.print("\n\t\tID: ");
			inputString = userInput.nextLine();
			for (index = 0; index < arraySize; ++index)
			{
				compareStrings = PersonList.get(index).getID();
				if (inputString.equals(compareStrings))
				{
					System.out.printf("\t\t\tSorry entered ID (%s) is invalid\n", inputString);
					break;
				}
			}
			if (inputString.equals(compareStrings))
			{	continue;	}
			else
			{	exit = 1;}
		}
		return inputString;
	}

	public String getName()
	{	return this.Name;}

	public String getID()
	{	return this.ID;}
}
class Student extends Person
{
	private double studentGPA;
	private int creditHours;

	public Student()
	{
		this.initializePerson();
		this.creditHours = 0;
	 	this.studentGPA  = 0;
	}
	
	public static Person assembleStudent(ArrayList<Person> PersonList, Scanner userInput)
	{
		Student student = new Student();
		System.out.println("\nEnter student info:");
		System.out.print("\t\tName of the student: ");
		student.setName(userInput.nextLine());
		student.setID(PersonList, userInput);
		student.setGPA(userInput);
		student.setCreditHours(userInput);
		return student;
	}

	public void setCreditHours(Scanner userInput)
	{	this.creditHours = assignCreditHours(userInput);}

	public static int assignCreditHours(Scanner userInput)
	{
		int exit = 0;
		String inputString = null;
		while (exit != 1)
		{
			System.out.print("\n\t\tCredit Hours: ");
			inputString = userInput.nextLine();
			for(char c: inputString.toCharArray())
			{
				if(c < '0' || c>'9' )
				{
					System.out.printf("\t\t\tSorry entered Credit Hours (%s) are invalid\n", inputString);
					exit = 0;
					break;
				}
				else 
				{	exit = 1;	}
				
			}
		}
		return Integer.valueOf(inputString);
	}

	public void setGPA(Scanner userInput)
	{	this.studentGPA = assignGPA(userInput);}

	public static double assignGPA(Scanner userInput)
	{
		int exit = 0;
		String inputString = null;
		while (exit != 1)
		{
			System.out.print("\n\t\tGpa: ");
			inputString = userInput.nextLine();
			for(char c: inputString.toCharArray())
			{
				if( c < '0'|| c >'9' || Character.isWhitespace(c) == true || Character.isAlphabetic(c) == true)
				{
					if (c == '.')
					{	continue;}
					System.out.printf("\t\t\tSorry entered GPA (%s) is invalid\n", inputString);
					exit = 0;
					break;
				}
				else
				{	exit = 1;}
			}
		 }
		 return Double.valueOf(inputString);
	}

	public int getCreditHours()
	{	return this.creditHours;}
	public double getGPA()
	{	return this.studentGPA;}

	public static void generateTuitionInvoice(ArrayList<Person> PersonList, Scanner userInput)
	{
		String inputString = null;
		String compareStrings = null;
		System.out.print("\tEnter the student's id: ");
		inputString = userInput.nextLine();
		for (int index = 0; index < PersonList.size(); ++index)
		{
			compareStrings = PersonList.get(index).getID();
			if (inputString.equals(compareStrings))
			{
				if (PersonList.get(index) instanceof Student)
				{
					Student.printTuitionInvoice((Student)PersonList.get(index));
					return;
				}
				else
				{
					System.out.println("\nSorry-student not found!\n");
					return;
				}
			}
		}
		System.out.printf("\n\tSorry %s doesn't exist\n\n", inputString);
		return;
	}
	public static void printTuitionInvoice(Student student)
	{
		double gpaThreshhold = 3.85;
		double rate = 236.45;
		double additiveFee = 52.00;
		double total = (student.getGPA() >= gpaThreshhold) ? (student.getCreditHours() * rate + additiveFee) * .75 : student.getCreditHours() * rate + additiveFee;
		double savings = student.getCreditHours() * rate + additiveFee - total;
		String formattedTotal = String.format("%,.2f", total);
		String formattedSavings= String.format("%,.2f", savings);
		System.out.printf("Here is the tuition invoice for %s :\n", student.getName());
		System.out.print("\n\t------------------------------------------------------------------------------------------\n");
		System.out.printf("\t%s\t\t\t\t%s\n\n", student.getName(), student.getID());
		System.out.printf("\tCredit Hours:%d ($%.2f/credit hour)\n\n", student.getCreditHours(), rate);
		System.out.printf("\tFee: $%.2f\n\n\n", additiveFee);
		System.out.printf("\tTotal payment: $%s\t\t\t\t($%s discount applied)", formattedTotal, formattedSavings);
		System.out.print("\n\t------------------------------------------------------------------------------------------\n");
		return;
	}	 
}
class Faculty extends Person
{
	private String Department;
	private String Rank;

	public Faculty()
	{
		this.initializePerson();
		this.Department = "";
		this.Rank  = "";
	}

	public static Person assembleFaculty(ArrayList<Person> PersonList, Scanner userInput)
	{
		Faculty faculty = new Faculty();
		System.out.println("\nEnter faculty info:\n");
		System.out.print("\t\tName of the faculty: ");
		faculty.setName(userInput.nextLine());
		faculty.setID(PersonList, userInput);
		faculty.setRank(userInput);
		faculty.setDepartment(userInput);
		return faculty;
	}

	public void setDepartment(Scanner userInput)
	{	this.Department = assignDepartment(userInput);}
	public static String assignDepartment(Scanner userInput)
	{
		int exit = 0;
		String inputString = null;
		while (exit != 1)
		{
			System.out.print("\n\t\tDepartment: ");
			inputString = userInput.nextLine();
			if (inputString.equalsIgnoreCase("mathematics")         == false && 
				inputString.equalsIgnoreCase("physics")             == false &&
				inputString.equalsIgnoreCase("engineering") 	    == false )
			{
				System.out.printf("\t\t\tSorry entered department (%s) is invalid\n", inputString);
				continue;
			}
			break;
		}
		inputString = inputString.toLowerCase();
		inputString = inputString.substring(0, 1).toUpperCase() + inputString.substring(1);
		return inputString;
	}

	public void setRank(Scanner userInput)
	{	this.Rank = assignRank(userInput);}

	public static String assignRank(Scanner userInput)
	{
		String inputString = null;
		int exit = 0;
		while (exit != 1)
		{
			System.out.print("\n\t\tRank: ");
			inputString = userInput.nextLine();
			if (inputString.equalsIgnoreCase("professor") == false && inputString.equalsIgnoreCase("adjunct") == false )
			{
				System.out.printf("\t\t\tSorry entered rank (%s) is invalid\n", inputString);
			}
			else
			{	exit = 1;}
		}
		inputString = inputString.toLowerCase();
		inputString = inputString.substring(0, 1).toUpperCase() + inputString.substring(1);
		return inputString;	
	}

	public String getDepartment()
	{	return this.Department;}

	public String getRank()
	{	return this.Rank;}

	public static void generateFacultyInfo(ArrayList<Person> PersonList, Scanner userInput)
	{
		 String inputString = null;
		 String compareStrings = null;
		 System.out.print("\n\tEnter the faculty's id: ");
		 inputString = userInput.nextLine();
		 for (int index = 0; index < PersonList.size(); ++index)
		 {
			compareStrings = PersonList.get(index).getID();
			if (inputString.equals(compareStrings))
			{
				if (PersonList.get(index) instanceof Faculty)
				{
					Faculty.printFacultyInfo((Faculty)PersonList.get(index));
					return;
				}
				else
				{
					System.out.println("\nSorry-faculty not found!\n");
					return;
				}
			}
		 }
		 System.out.printf("\n\tSorry %s doesn't exist\n\n", inputString);
	}
	public static void printFacultyInfo(Faculty faculty)
	{
		System.out.println("Faculty Found\n");
		System.out.print("\t------------------------------------------------------------------------------------------\n\n");
		System.out.printf("\t%s\n\n", faculty.getName());
		System.out.printf("\t%s Department, %s\n\n", faculty.getDepartment(), faculty.getRank());
		System.out.print("\t------------------------------------------------------------------------------------------\n");
		return;
	}
}
