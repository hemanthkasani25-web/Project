import java.util.*;

public class WorkoutManager {

    static LinkedList<String> workouts=new LinkedList<>();
    static Stack<String> history=new Stack<>();

    public static void logWorkout(Scanner sc){

        System.out.print("Enter workout: ");
        String w=sc.next();

        workouts.add(w);
        history.push(w);

        System.out.println("Workout Logged");
    }

    public static void showWorkouts(){

        System.out.println("Workouts:");

        for(String w:workouts)
            System.out.println(w);
    }

    public static void showHistory(){

        System.out.println("Workout History:");

        while(!history.isEmpty())
            System.out.println(history.pop());
    }

}