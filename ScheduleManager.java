import java.util.*;

public class ScheduleManager {

    static HashMap<Integer,Boolean> progress = new HashMap<>();

    static String RED = "\u001B[31m";
    static String RESET = "\u001B[0m";

    static int totalDays = 30;

    public static void initialize(){

        progress.clear();

        for(int i=1;i<=totalDays;i++){

            progress.put(i,false);

        }

    }

    public static int getTodayDay(){

        Calendar cal = Calendar.getInstance();

        return cal.get(Calendar.DAY_OF_MONTH);

    }

    public static void showTracker(){

        if(BMIManager.weeklySchedule.isEmpty()){

            System.out.println("Generate BMI plan first.");
            return;

        }

        int today = getTodayDay();

        System.out.println("\n===== MONTHLY PROGRESS TRACKER =====");

        for(int day=1;day<=totalDays;day++){

            if(progress.get(day)){

                System.out.println("Day "+day+" -> DONE");

            }

            else if(day < today){

                System.out.println(RED+"Day "+day+" -> MISSED"+RESET);

            }

            else if(day == today){

                System.out.println("Day "+day+" -> TODAY");

            }

            else{

                System.out.println("Day "+day+" -> LOCKED");

            }

        }

    }

    public static void markToday(){

        int today = getTodayDay();

        progress.put(today,true);

        System.out.println("Workout marked DONE for today.");

    }

}