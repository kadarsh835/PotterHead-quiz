# PotterHead? We got a quiz for you!

## Installing and running the application
### Installing Angular CLI
  - First of all make sure you have node and npm installed. Check this using the following commands: `node --version` and `npm --version`
  - Install Angular CLI
    - Check you have Angular CLI installed using the command `ng version`
    - If you don't have Angular CLI installed, install it using the command:
      ```bash
        npm install -g @angular/cli
      ```
    - Check if the Angular CLI was correctly installed using the command `ng version` . You need to have angular CLI installed to run the application.

### Clone the Angular Application (If you have access to the GitHub Repo. If not, go to next step)
- Clone the repository:
  ```bash
    git clone "https://github.com/kadarsh835/PotterHead-quiz.git"
  ```
- Navigate to the folder containing the `src` folder using the `cd` command

### Unzip the application(If you have the zipped folder instead)
- Unzip the application
- Navigate to the folder containing the `src` folder using the `cd` command

### Installing dependencies of the project
- Install the project dependencies
  ```bash
  npm install --save-dev @angular-devkit/build-angular
  ```
### Running the application
- Run the application
  ```bash
  ng serve --open
  ```
- The above process will compile all the node modules that the project uses, and hence will take some time. This will take time only for the first time that you run the application.
- From the next time you have to run the application, you just have to run the command `ng serve` and navigate to the [URL](http://localhost:4200) (or paste this link in your browser: http://localhost:4200) in your browser and this will open up the application.

### Installing and starting the Development Sserver(JSON-Server)
This project makes use of a simple server for fetching the questions, their answers and the gifs.
#### Installing JSON-Server
Installing and running a JSON Server is very easy.
- Keep the terminal with the `ng serve` command open and running. Open another instance of the terminal and type in the command:
  ```bash
  npm install -g json-server
  ```
  This will install the JSON-Server on your device and hereafter you would be able to use the command `json-server` in your terminal.
#### Starting JSON-Server to fetch the questions for you
The JSON-Sever needs to read a database file contents and serve them to your application.
- Navigate into the folder containing the Angular application.(The folder which contains the `src` folder). Type in the terminal the following commands in order:
  ```bash
  cd json-server
  ```
  ```bash
  json-server db.json
  ```
Thats it!!! Open your favorite browser and navigate to this [URL](http://localhost:4200) (or paste this link in your browser: http://localhost:4200) and enjoy the quiz. 
