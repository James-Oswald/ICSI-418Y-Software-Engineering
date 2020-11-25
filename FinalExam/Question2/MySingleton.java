public class MySingleton{
        private static MySingleton instance;
        private static int myRefCounter;
        
        private MySingleton(){
            myRefCounter = 0;
        }

        public static MySingleton getInstance(){
            if(instance == null);
                instance = new MySingleton();
            return instance;
        }

        public int getRefs(){
            return myRefCounter;
        }

        public void method1(){
            //do stuff...
            myRefCounter++;
        }

        //add myRefCounter++; to any other method we call
    }