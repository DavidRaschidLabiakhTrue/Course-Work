/*
	- Project 3
	- David Raschid Labiakh-True 	
*/

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;

import java.util.Map;
import java.util.Set;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import java.util.ArrayList;   

import java.text.SimpleDateFormat;
import java.awt.Component;

import java.awt.Font;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.FileWriter;

class Project3 
{
	public static void main(String[] args)
	{
		
		HashMap<String, Person> peopleMap = new HashMap<String, Person>(100);
		ReferenceSet facultyCompare = new ReferenceSet();
		boolean exit = false;
		SelectionSystem operator = new SelectionSystem();
		do
		{

			switch(operator.setChoice())
			{
					case 1:
						operator.calibrateDisplay();
						operator.assembleFaculty(peopleMap, facultyCompare);
						break;
					case 2:
						operator.calibrateDisplay();
						operator.assembleStudent(peopleMap);
						break;
					case 3:
						operator.calibrateDisplay();
						Student.printTuitionInvoice(operator, peopleMap);
						break;
					case 4:
						operator.calibrateDisplay();
						Faculty.printFacultyInfo(operator, peopleMap);
						break;
					case 5:
						operator.calibrateDisplay();
						operator.chooseYesNo( peopleMap);
						operator.frame.dispose();
						exit = true;
						break;
			}
		}while(exit != true);
			return;
		}
	
}
class SelectionSystem
{
	public JPanel panel;
	public JFrame frame;
	public JTextField userText;
	public JTextField userInputCreatePerson;
	public JButton button;
	public JLabel oldExceptionLabel;
	public JLabel greetUser;
	public JLabel printedOptions;
	public JLabel askUser;
	public JLabel studentFormation;
	public JLabel studentFormationInput;
	public JLabel facultyFormation;
	public JLabel facultyFormationInput;
	public JLabel thankYouMessage;
	public String pass;
	public String userChoice;
	public String localString;
	public String no;
	public SelectionSystem()
	{
		oldExceptionLabel = studentFormation         = studentFormationInput = facultyFormation = facultyFormationInput = thankYouMessage =  null;
		userText          = userInputCreatePerson    = null;
		pass              = userChoice = localString = no                    = null;
		button            = null;
		panel             = new JPanel();
		frame 			  = new JFrame();
		frame.setSize(900,500);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.add(panel);
		panel.setLayout(null);
		this.addInvisibleComponent(greetUser = new JLabel("Personnel Management Program"),200,10,300,25);
		greetUser.setFont(new Font(Font.MONOSPACED, Font.BOLD, greetUser.getFont().getSize()));
		printedOptions = new JLabel("<html>Choose one of the options:<br/>"
									+ "1- Add a new Faculty Member<br/>"
									+ "2- Add a new Student<br/>"
									+ "3- Print tuition invoice for a student<br/>"
									+ "4- Print information of a faculty<br/>"
									+ "5- Exit Program<html>");
		this.addInvisibleComponent(printedOptions, 10,40,350,140);
		this.addInvisibleComponent(askUser = new JLabel("Enter your selection:"), 50, 110,350,140);
		this.addInvisibleComponent(this.thankYouMessage = new JLabel("Thank you!"),190, 220, 200, 19);
		frame.setVisible(true);
	}
	public void calibrateDisplay()
	{
		this.greetUser.setVisible(false);
		this.printedOptions.setVisible(false);
		this.askUser.setVisible(false);
		panel.revalidate();
		panel.repaint();
	}
	public void recalibrateDisplay()
	{
		this.greetUser.setVisible(true);
		this.printedOptions.setVisible(true);
		this.askUser.setVisible(true);
		panel.revalidate();
		panel.repaint();
	}
	public int setChoice()
	{
		boolean exit 			   = false;
		String inputString  	   = null;
		int inputInt 			   = 0;
		JLabel exceptionLabel      = null;
		this.recalibrateDisplay();
		this.addCompenent(userText = new JTextField(), 170, 170,14,19);
		
		this.addInvisibleComponent(exceptionLabel = new JLabel(), 190, 170,190,19);
		while (exit != true)
		{
			try 
			{
				inputInt = Integer.parseInt(inputString = this.queryInput(this.userText));
				if (inputString.length() != 1 || inputInt > 5 || inputInt < 1)
				{	throw new Exception();}
				this.killAndClean(oldExceptionLabel);
				this.killAndClean(exceptionLabel);
				this.killAndClean(userText);
				exit = true;
			}
			catch (Exception er)
			{	
				this.killAndClean(oldExceptionLabel);
				exceptionLabel.setText("Invalid Entry-please try again");	
				this.revealComponent(exceptionLabel);
			}
		 }
		return inputInt;
	}	
	public void revealComponent(Component arg)
	{
		arg.setVisible(true);
		panel.revalidate();
		panel.repaint();
	}
	public void hideComponent(Component arg)
	{
		arg.setVisible(false);
		panel.revalidate();
		panel.repaint();
	}
	public void assembleStudent(HashMap<String, Person> peopleMap)
	{
		this.addInvisibleComponent(studentFormation = new JLabel("<html>Enter the student's info:<html>"),10,10,350,50);
		this.addInvisibleComponent(studentFormationInput = new JLabel("<html>Name of Student: <br/><br/>"
									+"ID: <br/><br/>"
									+"Gpa: <br/><br/>"
									+"Credit hours: <html>"),
									120,30,350,190);
		Student student = new Student();
		revealComponent(studentFormation);
		revealComponent(studentFormationInput);
		
		userInputCreatePerson = new JTextField();
		userInputCreatePerson.setVisible(false);
		panel.add(userInputCreatePerson);
		
		
		student.setFullName(this);
		this.hideComponent(userInputCreatePerson);
		JLabel name = new JLabel(student.getName());
		this.addCompenent(name,240, 67,130,19);
		this.revealComponent(name);
		
		
		student.setID(peopleMap, this);
		this.hideComponent(userInputCreatePerson);
		JLabel idLabel = new JLabel(student.getID());
		this.addCompenent(idLabel, 240, 97 ,130,19);
		this.revealComponent(idLabel);
		
		student.setStudentGpa(this);
		this.hideComponent(userInputCreatePerson);
		JLabel gpaLabel = new JLabel(Double.toString(student.getStudentGpa()));
		this.addCompenent(gpaLabel, 240, 128 ,130,19);
		this.revealComponent(gpaLabel);		
				
		student.setCreditHours(this);
		this.hideComponent(userInputCreatePerson);
		JLabel credit = new JLabel(Integer.toString(student.getCreditHours()));
		this.addCompenent(credit,240 ,158 ,130 ,19);
		this.revealComponent(credit);
		
		this.returnFromScreen("Return To Home");	
		
		panel.remove(name);
		panel.remove(idLabel);
		panel.remove(gpaLabel);
		panel.remove(credit);
		panel.remove(userInputCreatePerson);
		panel.remove(studentFormation);
		this.killAndClean(studentFormationInput);
		return;
	}
	public void assembleFaculty(HashMap<String, Person> peopleMap, ReferenceSet facSet)
	{
		
		this.addInvisibleComponent(facultyFormation = new JLabel("<html>Enter the Faculty's info:<html>"), 10,10,350,50);									
		this.addInvisibleComponent(facultyFormationInput = new JLabel("<html>Name of the faculty: <br/><br/>"
												+"ID: <br/><br/>"
												+"Department: <br/><br/>"
												+"Rank: <html>"),
												120,30,350,190);
		
		Faculty faculty = new Faculty();
		revealComponent(facultyFormation);
		revealComponent(facultyFormationInput);
		
		userInputCreatePerson = new JTextField();
		userInputCreatePerson.setVisible(false);
		panel.add(userInputCreatePerson);
		
		faculty.setFullName(this);
		this.hideComponent(userInputCreatePerson);
		JLabel name = new JLabel(faculty.getName());
		this.addCompenent(name, 240, 67,130,19);
		this.revealComponent(name);
		
		faculty.setID(peopleMap, this);
		this.hideComponent(userInputCreatePerson);
		JLabel idLabel = new JLabel(faculty.getID());
		this.addCompenent(idLabel, 240, 97 ,130,19);
		this.revealComponent(idLabel);
		
		faculty.setDepartment(this, facSet.getDepartmentSet());
		this.hideComponent(userInputCreatePerson);
		JLabel departmentLabel = new JLabel(faculty.getDepartment());
		this.addCompenent(departmentLabel,240, 128 ,130,19);
		this.revealComponent(departmentLabel);

		faculty.setRank(this, facSet.getRankSet());
		this.hideComponent(userInputCreatePerson);
		JLabel rank = new JLabel(faculty.getRank());
		this.addCompenent(rank, 240, 158 ,130,19);
		this.revealComponent(rank);
		
		this.returnFromScreen("Return To Home");
		
		panel.remove(name);
		panel.remove(idLabel);
		panel.remove(departmentLabel);
		panel.remove(rank);
		panel.remove(userInputCreatePerson);
		panel.remove(facultyFormation);
		this.killAndClean(facultyFormationInput);
		return;
	}
	public void makeReport(HashMap<String, Person> peopleMap)
	{
		if (peopleMap.size() == 0)
		{
			JLabel noOne = new JLabel("No entries were made.");	
			panel.add(noOne);
			this.revealComponent(noOne);
			return;
		}
		// A private joke made at an immature point an time. This would not be done again.
		ArrayList<String> engineerWeirdos     = new ArrayList<String>(100);
		ArrayList<String> mathematicianChads  = new ArrayList<String>(100);
		ArrayList<String> physicistWimps 	  = new ArrayList<String>(100);
		ArrayList<String> sortedHash     	  = new ArrayList<String>(100);
		ArrayList<String> arrogantStudents	  = new ArrayList<String>(100);
		Person sort 						  = null;
		FileWriter writeReport 				  = null;
		SimpleDateFormat formatter 			  = null;
		Date date							  = null;
		// Explicitly 1
		int index;
		for(Map.Entry<String, Person> loader : peopleMap.entrySet())
		{	
			// if faculty, throw in switch sort: O(1), else add reference into student arraylist
			if ( (sort = loader.getValue()) instanceof Faculty )
			{
				switch(((Faculty)sort).getDepartment())
				{
					case "Engineering":
						engineerWeirdos.add(sort.getID());
						break;
					case "Mathematics":
						System.out.println("Procc");
						mathematicianChads.add(sort.getID());
						break;
					case "Physics":
						physicistWimps.add(sort.getID());
						break;
				}
			}
			else
			{	arrogantStudents.add(sort.getID());}
		}
		// Combine all faculty array lists into 1. They are already naturally sorted by department by the previous for loop.
		sortedHash.addAll(engineerWeirdos);
		sortedHash.addAll(mathematicianChads);
		sortedHash.addAll(physicistWimps);
		try
		{
			// Just file writing at this point. It's not going to look nice. Considered making it's own class. 
			// Decided it's not worth the time without other functional upgrades. I may be making a pretty long method here, but it's only doing 1 thing always.
			// Making a report.
			writeReport = new FileWriter("report.dat");
			formatter   = new SimpleDateFormat("MM/dd/yyyy");
			date        = new Date(); 
			writeReport.write("\t\tReport created on " + formatter.format(date)+"\n");
			writeReport.write("\t\t****************************\n\n");
			writeReport.write("Faculty Members (Sorted by Department)\n");
			writeReport.write("--------------------------------------------------\n");
			for (index = 0; index < sortedHash.size(); index++)
			{
				sort = peopleMap.get(sortedHash.get(index));
				writeReport.write((index + 1) + "." + sort.getName() + "\n");
				writeReport.write("ID: " + sort.getID() + "\n");
				writeReport.write( ((Faculty)sort).getRank() +  ", " + ((Faculty)sort).getDepartment() + "\n\n");
			}
			writeReport.write("Students\n");
			writeReport.write("-----------\n");
			for (index = 0; index < arrogantStudents.size(); index++ )
			{
				sort = peopleMap.get(arrogantStudents.get(index));
				writeReport.write((index+1) + "." + sort.getName() + "\n");
				writeReport.write("ID: " + sort.getID() + "\n");
				writeReport.write("Gpa: " +  ((Student)sort).getStudentGpa() +  "\n");
				writeReport.write("Credit hours: " +  ((Student)sort).getCreditHours() +  "\n\n");
				
			}
			writeReport.close();
			oldExceptionLabel = new JLabel("Your file has been created!");
			oldExceptionLabel.setBounds(10,40,350,140);
			oldExceptionLabel.setVisible(true);
			panel.add(oldExceptionLabel);
			panel.validate();
			panel.repaint();
			return;
		}
		// This should never execute hopefully!
		catch (Exception er)
		{
			System.out.println(er.getMessage());
			System.out.printf("Uh oh");
		}
	}
	public void chooseYesNo(HashMap<String, Person> peopleMap)
	{
		String inputString = null;
		boolean exit       = false;
		this.addInvisibleComponent(userInputCreatePerson = new JTextField(),250, 57 ,14,19);
		
		JLabel askYesNo    = new JLabel("Would you like to create the report? (Y/N): ");
		this.addCompenent(askYesNo, 10, 57 ,250,19);

		JLabel exceptionLabel = null;
		this.addInvisibleComponent(exceptionLabel = new JLabel(), 270,57,350,19);
		while (exit != true)
		{
			try 
			{	
				if ( ((inputString = this.queryInput(userInputCreatePerson)).toLowerCase().length()) > 1 || 
					  inputString.length() == 0 					   				 ||
					 (inputString.toLowerCase().charAt(0) != 'n'					 &&
					  inputString.toLowerCase().charAt(0) != 'y'						))
				{	throw new GenException("Sorry entered choice (" + inputString + ") is invalid");}
				exit = true;
			}
			catch (GenException er)
			{
				exceptionLabel.setText(er.getException());	
				this.revealComponent(exceptionLabel);	
			}
		}
		if (Character.compare(inputString.charAt(0), 'n') == 0 )
		{	
			exceptionLabel.setText("Goodbye!");	
			this.killAndClean(userInputCreatePerson);
			this.revealComponent(exceptionLabel);
			this.returnFromScreen("Exit Program");
			return;			  
		}
		else
		{	
			makeReport(peopleMap);
			this.killAndClean(userInputCreatePerson);
			exceptionLabel.setText("Goodbye!");	
			this.revealComponent(exceptionLabel);
			this.returnFromScreen("Exit Program");
		}
	}
	// Probably the most magical thing in this entire program.
	// Generic text input scanner. Works shockingly well. 
	// None of the documentation I found had this method style. 
	
	public String queryInput(JTextField argument)
	{
		// This assignment does a nice refresh on the pass string each time.
		// This actually allows the system to reuse the queryInput
		pass                = null;
		KeyListener cleanup = null;
		argument.addKeyListener(cleanup = new KeyListener()
		{
			@Override
			public void keyPressed(KeyEvent e) 
			{		
						if (e.getKeyCode() == KeyEvent.VK_ENTER)
						{	pass = argument.getText();}
			}
			@Override
			public void keyReleased(KeyEvent e) {}
			@Override
			public void keyTyped(KeyEvent e) {}

		});
		revealComponent(argument);
		while (loopInput(pass) == false);
		argument.removeKeyListener(cleanup);
		argument.setText(null);
		return pass;
	}	
	public boolean loopInput(String pass)
	{
		if (pass == null)
		{
			try 
			{	Thread.sleep(100);}
			catch (InterruptedException e) 
			{	e.printStackTrace();}
			return false;
		}
		return true;
	}
	public void returnFromScreen(String userLeaveCondition)
	{
		this.revealComponent(thankYouMessage);
		button = new JButton(userLeaveCondition);
		button.addActionListener(new ActionListener() 
		{
			@Override
			public void actionPerformed(ActionEvent e) 
			{	no = "yes";}
		});
		button.setBounds(120, 240, 200, 19);
		panel.add(button);
		this.revealComponent(button);
		while (loopInput(no) == false);
		no = null;
		thankYouMessage.setVisible(false);
		this.killAndClean(button);
		return;
	}
	public void killAndClean(Component arg)
	{
		if (arg != null)
		{
			this.panel.remove(arg);
			this.panel.validate();
			this.panel.repaint();
		}
	}
	public void addInvisibleComponent(Component arg, int xBound, int yBound, int width, int height)
	{
		arg.setBounds(xBound, yBound, width, height);
		arg.setVisible(false);
		this.panel.add(arg);
	}
	public void addCompenent(Component arg, int xBound, int yBound, int width, int height)
	{
		arg.setBounds(xBound, yBound, width, height);
		this.panel.add(arg);
	}
}
// Not really a true class or thing. More like an embedded reference table to glance at. 
// Done in this format specifically because more conditions can be freely added into these arrays. 
// If I wanted to add "Arts", it wouldn't take a giant condition. Just type "arts" at the end of compareDepartment.
// Although a file that sets these conditions would be better.
class ReferenceSet
{
	private String[] compareDepartment = { "engineering", "physics", "mathematics"};
	private String[] compareRank	   = { "professor", "adjunct"};
	private Set<String> refDepartment  = null;
	public Set<String> refRank 		   = null;
	public ReferenceSet()
	{
		this.refDepartment = new HashSet<String>(Arrays.asList(this.compareDepartment));
		this.refRank	   = new HashSet<String>(Arrays.asList(this.compareRank));
	}
	public Set<String> getDepartmentSet()
	{	return this.refDepartment;}
	public Set<String> getRankSet()
	{	return this.refRank;}
}
class Person
{
	public String fullName = null;
	private String ID = null;
	public Person()
	{	this.fullName = this.ID = null;}
	public String getName()
	{	return this.fullName;}
	public String getID()
	{	return this.ID;}
	public void setFullName(SelectionSystem operator)
	{
		operator.userInputCreatePerson.setBounds(240, 67,130,19);
		this.fullName = operator.queryInput(operator.userInputCreatePerson);
	}
	public void setID(HashMap<String, Person> peopleMap, SelectionSystem operator)
	{
		boolean state = false;
		operator.userInputCreatePerson.setBounds(240, 97 ,130,19);
		JLabel exceptionLabel = null;
		operator.addInvisibleComponent(exceptionLabel = new JLabel(),340, 97 , 390,19);
		while (state != true)
		{
			try
			{
				this.ID = operator.queryInput(operator.userInputCreatePerson);
				if (this.ID.length() != 6 						   ||
					!Character.isLetter(this.ID.charAt(0)) 		   ||
					!Character.isDigit(this.ID.charAt(5))  		   ||
					!Character.isLetter(this.ID.charAt(1))         ||
					!Character.isDigit(this.ID.charAt(4))          ||
					!Character.isDigit(this.ID.charAt(2))          ||
					!Character.isDigit(this.ID.charAt(3))  	 		 )
				{	throw new IdException();}
				if (peopleMap.containsKey(this.ID))
				{	throw new IdException("Sorry Duplicate id (" + this.ID + ") is not allowed");}
				peopleMap.put(this.ID, this);
				operator.killAndClean(exceptionLabel);
				return;
			}
			catch (IdException er)
			{	
				exceptionLabel.setText(er.getException());	
				operator.revealComponent(exceptionLabel);
			}
		}
	}
}
class Student extends Person
{
	private double studentGPA;
	private int creditHours;
	public Student()
	{	this.studentGPA = this.creditHours  = 0;}
	public void setStudentGpa(SelectionSystem operator)
	{
		boolean exit       = false;
		String inputString = null;
		operator.userInputCreatePerson.setBounds(240, 128 ,130,19);
		JLabel exceptionLabel = new JLabel();
		operator.addInvisibleComponent(exceptionLabel,370, 128 ,430,19);
		while (exit != true)
		{
			try 
			{
				this.studentGPA = Double.parseDouble(inputString = operator.queryInput(operator.userInputCreatePerson));
				operator.killAndClean(exceptionLabel);
				exit = true;
			}
			catch (Exception er)
			{	
				exceptionLabel.setText("Sorry entered GPA (" + inputString + ") is invalid");	
				operator.revealComponent(exceptionLabel);
			}
		 }
	}
	public double getStudentGpa()
	{	return this.studentGPA;}
	public void setCreditHours(SelectionSystem operator)
	{
		boolean exit 		= false;
		String inputString  = null;
		operator.userInputCreatePerson.setBounds(240, 158 ,130,19);
		JLabel exceptionLabel = new JLabel();
		operator.addInvisibleComponent(exceptionLabel,370, 158 ,430,19);
		while (exit != true)
		{
			try 
			{
				this.creditHours = Integer.parseInt(inputString = operator.queryInput(operator.userInputCreatePerson));
				operator.killAndClean(exceptionLabel);
				exit = true;
			}
			catch (Exception er)
			{	
				exceptionLabel.setText("Sorry entered Credit Hours (" + inputString + ") is invalid");	
				operator.revealComponent(exceptionLabel);
			}
		 }
	}
	public int getCreditHours()
	{	return this.creditHours;}
	public static void printTuitionInvoice(SelectionSystem operator, HashMap<String, Person> peopleMap)
	{
		// Again, a template class would probably be the best thing to do here.
		// I am adhering strictly to 1 file only however, making that a no for now.
		Person student             = null;
		operator.oldExceptionLabel = null;
		double gpaThreshhold       = 3.85;
		double rate 		       = 236.45;
		double additiveFee         = 52.00;
		double total;
		String formattedTotal      =  null;
		String formattedSavings    = null;
		String inputString         = null;
		JLabel[] arrayPrint        = new JLabel[10];
		for (int i = 0; i < 10; i++)
		{	arrayPrint[i] = new JLabel();}
		
		arrayPrint[0].setText("Enter the student's id:");
		operator.addCompenent(arrayPrint[0], 10, 10, 350, 50);
		operator.revealComponent(arrayPrint[0]);
		
		
		operator.addCompenent(operator.oldExceptionLabel = new JLabel(), 190, 110, 350, 140);
		
		operator.addCompenent(operator.userInputCreatePerson = new JTextField(), 150, 27 ,130,19);
		operator.revealComponent(operator.userInputCreatePerson);

		try 
		{
			if (!peopleMap.containsKey(inputString = operator.queryInput(operator.userInputCreatePerson)))
			{	throw new GenException("Sorry-" + inputString + " doesn't exist");}
			if (!((student = peopleMap.get(inputString)) instanceof Student))
			{	throw new GenException("Sorry-student not found!");}
			operator.killAndClean(operator.userInputCreatePerson);
						formattedTotal = String.format("%,.2f", total = (((Student)student).getStudentGpa() >= gpaThreshhold) 
											? 
											(((Student)student).getCreditHours() * rate + additiveFee) * .75 :
											 ((Student)student).getCreditHours() * rate + additiveFee);
			formattedSavings = String.format("%,.2f", ((Student)student).getCreditHours() * rate + additiveFee - total);
			// Rather make this explicit instead of making some kind of looped assignment process. Looping would make debugging near impossible.
			// Looks like it would be hard to read at first. It's numbered explicitly by the array indexes, making parsing easy for the reader.
			arrayPrint[1].setText("Here is the tuition invoice for " + student.getName());
			operator.addCompenent(arrayPrint[1], 190, 37 ,300,50);
			arrayPrint[2].setText("\t------------------------------------------------------------------------------------------");
			operator.addCompenent(arrayPrint[2],190, 57,400,50);
			arrayPrint[3].setText(student.getName());
			operator.addCompenent(arrayPrint[3], 190, 77,350,50);
			arrayPrint[4].setText(student.getID());
			operator.addCompenent(arrayPrint[4], 360, 77,350,50);
			arrayPrint[5].setText("Credit Hours: " + ((Student)student).getCreditHours() +  " ($" + String.format("%,.2f", rate) + "/credit hour)");
			operator.addCompenent(arrayPrint[5],190, 97,350,50);
			arrayPrint[6].setText("Fee: $" + String.format("%,.2f", additiveFee));
			operator.addCompenent(arrayPrint[6],190, 117,350,50);
			arrayPrint[7].setText("Total payment: $" + formattedTotal);
			operator.addCompenent(arrayPrint[7],190, 137,350,50);
			arrayPrint[8].setText("($" + formattedSavings + " discount applied)");
			operator.addCompenent(arrayPrint[8],360, 137,350,50);
			arrayPrint[9].setText(arrayPrint[2].getText());
			operator.addCompenent(arrayPrint[9],190, 157,400,50);
			
			operator.returnFromScreen("Exit Tuition Invoice");
			operator.killAndClean(operator.userInputCreatePerson);
		}
		catch (GenException er)
		{	
			operator.killAndClean(operator.userInputCreatePerson);
			operator.oldExceptionLabel.setText(er.getException());	
			operator.revealComponent(operator.oldExceptionLabel);
		}
		for (int i = 0; i < 10; i++)
		{		operator.panel.remove(arrayPrint[i]);}
	}
}

class Faculty extends Person
{
	private String department;
	private String rank;
	public Faculty()
	{	this.department = this.rank =  null;}
	public void setDepartment(SelectionSystem operator, Set<String> facultySet)
	{
		boolean exit = false;
		JLabel exceptionLabel = null;
		operator.userInputCreatePerson.setBounds(240, 128 ,130,19);
		operator.addInvisibleComponent(exceptionLabel  = new JLabel(), 370, 128, 430, 19);
		while (exit != true)
		{
			try
			{
				if(!facultySet.contains(this.department = operator.queryInput(operator.userInputCreatePerson).toLowerCase() ) )
				{	throw new Exception();}
				operator.killAndClean(exceptionLabel);
				exit=true;
			}
			catch (Exception er)
			{	
				exceptionLabel.setText("Sorry entered department (" + this.department + ") is invalid\n");	
				operator.revealComponent(exceptionLabel);
			}
		}
		// Corrects silly user inputs. Takes the entire string, ensures the first letter is made capital. Entire String is made lower case at the start of the try.
		this.department = this.department.substring(0, 1).toUpperCase() + this.department.substring(1);	
	}
	public String getDepartment()
	{	return this.department;}
	public void setRank(SelectionSystem operator, Set<String> facultySet)
	{
		boolean exit          = false;
		JLabel exceptionLabel = null;
		operator.userInputCreatePerson.setBounds(240, 158 ,130,19);
		operator.addInvisibleComponent(exceptionLabel = new JLabel(), 370, 158 ,430,19);
		while (exit != true)
		{
			try
			{
				if(!facultySet.contains(this.rank = operator.queryInput(operator.userInputCreatePerson).toLowerCase() ) )
				{	throw new Exception();}
				operator.killAndClean(exceptionLabel);
				exit=true;
			}
			catch (Exception er)
			{	exceptionLabel.setText("Sorry entered rank (" + this.rank + ") is invalid\n");
				operator.revealComponent(exceptionLabel);}
		}
		this.rank = this.rank.substring(0, 1).toUpperCase() + this.rank.substring(1);
	}
	public String getRank()
	{	return this.rank;}
	public static void printFacultyInfo(SelectionSystem operator, HashMap<String, Person> peopleMap)
	{
		String inputString  = null;
		Person faculty      = null;
		JLabel[] arrayPrint = new JLabel[6];
		for (int i = 0; i < 6; i++)
		{	arrayPrint[i] = new JLabel();}
		arrayPrint[0].setText("Enter the faculty's id:");
		operator.addCompenent(arrayPrint[0], 10, 10, 350, 50);
		operator.revealComponent(arrayPrint[0]);
		
		operator.addCompenent(operator.userInputCreatePerson = new JTextField(), 150, 27, 130, 19);
		operator.revealComponent(operator.userInputCreatePerson);

		operator.addCompenent(operator.oldExceptionLabel = new JLabel(), 190, 110,350,140);
		operator.panel.add(operator.oldExceptionLabel);
		try 
		{
			if (!peopleMap.containsKey(inputString = operator.queryInput(operator.userInputCreatePerson)))
			{	throw new GenException("Sorry-" + inputString + " doesn't exist");}
			if (!((faculty = peopleMap.get(inputString)) instanceof Faculty))
			{	throw new GenException("Sorry-faculty not found!");}
			operator.killAndClean(operator.userInputCreatePerson);
			arrayPrint[0].setVisible(false);
			
			arrayPrint[1].setText("Faculty Found");
			operator.addCompenent(arrayPrint[1], 10,10,350,50);
			
			arrayPrint[2].setText("------------------------------------------------------------------------------------------");
			operator.addCompenent(arrayPrint[2], 50, 37 ,400,50);

			arrayPrint[3].setText(faculty.getName());
			operator.addCompenent(arrayPrint[3], 50, 57 ,300,50);

			arrayPrint[4].setText(((Faculty)faculty).getDepartment() + " Department, " + ((Faculty)faculty).getRank());
			operator.addCompenent(arrayPrint[4], 50, 77 ,300,50);
			
			arrayPrint[5].setText(arrayPrint[2].getText());
			operator.addCompenent(arrayPrint[5], 50, 97 ,400,50);

			operator.returnFromScreen("Exit Faculty Info");
			
		}
		catch (GenException er)
		{	
			operator.killAndClean(operator.userInputCreatePerson);
			operator.oldExceptionLabel.setText(er.getException());	
			operator.revealComponent(operator.oldExceptionLabel);
		}
		for (int i = 0; i < 6; i++)
		{ operator.panel.remove(arrayPrint[i]);}
	}
}
class GenException extends Exception
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 342117824365582041L;
	private String message = null;
	public GenException()
	{	this.message = "Something Bad Happened";}
	public GenException(String argument)
	{	this.message = argument;}
	public String getException()
	{	return this.message;}
}
class IdException extends GenException
{
	/**
	 * 
	 */
	// Auto generated, nothing special.
	private static final long serialVersionUID = -6497412159498544093L;
	private String message = null;
	public IdException()
	{	this.message = ("Sorry Invalid id format-It has to be LetterLetterDigitDigitDigitDigit");}
	public IdException(String argument)
	{	this.message = argument;}
	public String getException()
	{	return this.message;}
}