import java.util.*;

public class BMIManager {

    static Queue<String> weeklySchedule = new LinkedList<>();

    static String category="";

    public static void calculateBMI(Scanner sc){

        System.out.print("Enter Height (cm): ");
        double height = sc.nextDouble();

        System.out.print("Enter Weight (kg): ");
        double weight = sc.nextDouble();

        height = height / 100;

        double bmi = weight / (height * height);

        System.out.println("\nYour BMI: " + String.format("%.2f", bmi));

        if(bmi < 18.5){

            category="Underweight";
            generateUnderweightPlan();

        }
        else if(bmi < 25){

            category="Normal Weight";
            generateNormalPlan();

        }
        else if(bmi < 30){

            category="Overweight";
            generateOverweightPlan();

        }
        else{

            category="Obese";
            generateObesePlan();

        }

        System.out.println("Category: " + category);

        System.out.println("\nGenerated Weekly Schedule:");

        for(String day : weeklySchedule){

            System.out.println(day);

        }

    }

    static void generateUnderweightPlan(){

        weeklySchedule.clear();

        weeklySchedule.add("Mon - Strength Training");
        weeklySchedule.add("Tue - Yoga + Mobility");
        weeklySchedule.add("Wed - Upper Body Workout");
        weeklySchedule.add("Thu - Active Rest");
        weeklySchedule.add("Fri - Lower Body Workout");
        weeklySchedule.add("Sat - Light Cardio");
        weeklySchedule.add("Sun - Rest");

    }

    static void generateNormalPlan(){

        weeklySchedule.clear();

        weeklySchedule.add("Mon - Cardio");
        weeklySchedule.add("Tue - Strength Training");
        weeklySchedule.add("Wed - Yoga");
        weeklySchedule.add("Thu - Cycling");
        weeklySchedule.add("Fri - Full Body Workout");
        weeklySchedule.add("Sat - Jogging");
        weeklySchedule.add("Sun - Rest");

    }

    static void generateOverweightPlan(){

        weeklySchedule.clear();

        weeklySchedule.add("Mon - Running");
        weeklySchedule.add("Tue - HIIT Workout");
        weeklySchedule.add("Wed - Cycling");
        weeklySchedule.add("Thu - Core Workout");
        weeklySchedule.add("Fri - Swimming");
        weeklySchedule.add("Sat - Brisk Walking");
        weeklySchedule.add("Sun - Yoga");

    }

    static void generateObesePlan(){

        weeklySchedule.clear();

        weeklySchedule.add("Mon - Walking");
        weeklySchedule.add("Tue - Light Yoga");
        weeklySchedule.add("Wed - Walking + Stretching");
        weeklySchedule.add("Thu - Swimming");
        weeklySchedule.add("Fri - Easy Cycling");
        weeklySchedule.add("Sat - Meditation");
        weeklySchedule.add("Sun - Rest");

    }

}