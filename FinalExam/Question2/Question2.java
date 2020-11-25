
public class Question2{
    public static void main(String[] args){
        MySingleton sing = MySingleton.getInstance();
        for(int i = 0; i < 10; i++)
            sing.method1();
        System.out.println(sing.getRefs());
    }
}