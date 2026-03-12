import java.util.*;

public class ProgramManager {

    static HashMap<String,String> userPrograms = new HashMap<>();

    public static void showPrograms(Scanner sc,String username){

        System.out.println("\n===== FITNESS PROGRAMS =====");

        System.out.println("1 Weight Loss");
        System.out.println("2 Muscle Gain");
        System.out.println("3 Home Workout");
        System.out.println("4 Yoga");

        System.out.print("Select Program: ");

        int choice = sc.nextInt();

        String program="";

        switch(choice){

            case 1:
                program="Weight Loss";
                break;

            case 2:
                program="Muscle Gain";
                break;

            case 3:
                program="Home Workout";
                break;

            case 4:
                program="Yoga";
                break;

            default:
                System.out.println("Invalid Choice");
                return;

        }

        userPrograms.put(username,program);

        System.out.println("Program '"+program+"' selected successfully!");

    }

    public static void showUserProgram(String username){

        if(userPrograms.containsKey(username)){

            System.out.println("Your Selected Program: "+userPrograms.get(username));

        }

        else{

            System.out.println("No program selected yet.");

        }

    }

}