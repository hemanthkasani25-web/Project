import java.util.*;

public class FitnessSystem {

    public static void main(String[] args){

        Scanner sc = new Scanner(System.in);

        UserManager.loadUsers();

        int choice;

        while(true){

            System.out.println("\n===== FITWORLD SYSTEM =====");

            System.out.println("1 Register");
            System.out.println("2 Login");
            System.out.println("3 Exit");

            choice = sc.nextInt();

            switch(choice){

                case 1:
                    UserManager.registerUser(sc);
                    break;

                case 2:

                    if(UserManager.loginUser(sc)){

                        int ch;

                        do{

                            System.out.println("\n===== DASHBOARD =====");

                            System.out.println("1 Calculate BMI");
                            System.out.println("2 Track Progress");
                            System.out.println("3 Programs");
                            System.out.println("4 Trainers");
                            System.out.println("5 Logout");

                            ch = sc.nextInt();

                            switch(ch){

                                case 1:

                                    BMIManager.calculateBMI(sc);

                                    ScheduleManager.initialize();

                                    break;

                                case 2:

                                    int trackerChoice = 0;

                                    while(trackerChoice != 2){

                                        ScheduleManager.showTracker();

                                        System.out.println("\n1 Mark Today's Exercise");
                                        System.out.println("2 Back");

                                        trackerChoice = sc.nextInt();

                                        if(trackerChoice == 1){

                                            ScheduleManager.markToday();

                                        }

                                    }

                                    break;

                                case 3:

                                    ProgramManager.showPrograms(sc,UserManager.currentUser);

                                    ProgramManager.showUserProgram(UserManager.currentUser);

                                    break;

                                case 4:

                                    TrainerManager.showTrainers();

                                    break;

                                case 5:

                                    System.out.println("Logged out successfully.");

                                    break;

                            }

                        }

                        while(ch != 5);

                    }

                    break;

                case 3:

                    System.out.println("Thank you for using FitWorld!");

                    System.exit(0);

            }

        }

    }

}   