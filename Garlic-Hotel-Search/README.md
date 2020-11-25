# Garlic-Hotel-Search  
```
                    
              ██░░██                  
              ████░░██                
                ██▓▓██                
                ██░░▓▓██              
              ██░░██░░██              
            ██░░░░████░░██            
          ██░░░░░░████░░░░██          
      ████░░░░░░██░░██░░░░░░████      
    ██░░░░░░░░▓▓██░░██▓▓░░░░░░░░██    
  ██░░░░  ░░░░██░░░░░░██░░░░    ░░██                      _ _        
██░░░░  ░░░░▓▓██░░  ░░░░██░░░░    ░░██                   | (_)        
██░░    ░░░░██░░░░  ░░░░▓▓██░░░░  ░░██    __ _  __ _ _ __| |_  ___  
██░░  ░░░░▓▓██░░    ░░░░▓▓██▓▓░░  ░░██   / _` |/ _` | '__| | |/ __|
██░░░░░░░░██░░    ░░░░░░░░▓▓██░░░░░░██  | (_| | (_| | |  | | | (__   
  ██░░░░▓▓██░░    ░░░░░░░░▓▓██▓▓░░██     \__, |\__,_|_|  |_|_|\___| 
  ██▓▓▓▓▓▓██░░░░    ░░░░░░▓▓██▓▓▓▓██      __/ |    
    ██████████░░░░░░░░░░▓▓████████       |___/    
```

## Setup
0. Install node.js and npm, make sure they're on your path.
1. Clone the project to your local machine.
2. Run `npm install` in the `source/server` directory, this will install the node packages needed for the backend, the frontend, and build the frontend.
3. Obtain a copy of `databaseCredentials.json` pinned in the discord for sync-mysql or write your own in, save the file at `/source/server/databaseCredentials.json`. You also need to @ethan to request he allows your IP through the database firewall. 
4. There are 2 ways to run the application test, run `npm start` from the `package.json` in `/source/server`, or use the vs code debug tool with the `Launch Appliction` compound found in `/.vscode/launch.json`. To test with vs code debuging tools you need [the VS code extension for chrome debugging](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and can then use the launch debugging config provided by `/.vscode/launch.json`.

## Layout
#### Root
* **.vscode/ :** VS code tools for advanced debug launching and vs code tasks
* **source/ :** Code for the application
* **.gitignore :** list of files that shoun't be uploaded to github (api keys, node modules)
#### Source
* **source/client/ :** frontend code
* **source/client/package.json :** frontend packages
* **source/client/js/ :** Frontend Javascript 
* **source/client/scss/ :** Custom Garlic CSS Framework
* **source/client/veiws/ :** Pug pages for the website and other resources 
* **source/server/ :** backend code
* **source/server/package.json :** backend packages
* **source/server/server.js :** backend entrypoint

