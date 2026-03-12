import java.util.*;
import java.io.*;

public class UserManager {

    static HashMap<String,User> users = new HashMap<>();

    static int codeCounter = 1;

    static final String FILE_NAME = "users.txt";

    static String currentUser = "";

    public static void loadUsers(){

        try{

            File file = new File(FILE_NAME);

            if(!file.exists())
                return;

            Scanner fs = new Scanner(file);

            while(fs.hasNextLine()){

                String line = fs.nextLine();

                String parts[] = line.split(",");

                String u = parts[0];
                String p = parts[1];
                String c = parts[2];

                users.put(u,new User(u,p,c));

                int num = Integer.parseInt(c.substring(2));

                if(num >= codeCounter)
                    codeCounter = num + 1;

            }

            fs.close();

        }

        catch(Exception e){

            System.out.println("Error loading users");

        }

    }

    public static void saveUser(User user){

        try{

            FileWriter fw = new FileWriter(FILE_NAME,true);

            fw.write(user.username+","+user.password+","+user.code+"\n");

            fw.close();

        }

        catch(Exception e){

            System.out.println("Error saving user");

        }

    }

    public static String generateCode(){

        return "HM"+String.format("%03d",codeCounter++);

    }

    public static void registerUser(Scanner sc){

        System.out.print("Enter Username: ");
        String u = sc.next();

        if(users.containsKey(u)){

            System.out.println("Username already exists!");
            return;

        }

        System.out.print("Enter Password: ");
        String p = sc.next();

        String code = generateCode();

        User user = new User(u,p,code);

        users.put(u,user);

        saveUser(user);

        System.out.println("Registration Successful");
        System.out.println("Your Code: "+code);

    }

    public static boolean loginUser(Scanner sc){

        System.out.print("Username: ");
        String u = sc.next();

        System.out.print("Password: ");
        String p = sc.next();

        System.out.print("Code: ");
        String c = sc.next();

        if(users.containsKey(u)){

            User user = users.get(u);

            if(user.password.equals(p) && user.code.equals(c)){

                currentUser = u;

                System.out.println("Login Successful");

                return true;

            }

        }

        System.out.println("Invalid Login");

        return false;

    }

}