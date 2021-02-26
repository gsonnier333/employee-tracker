const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "manage_db"
});

function connect(){
  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
  
    console.log("connected as id " + connection.threadId);
  });
};
  
  
function displayEmployees(){
    connection.query("SELECT * FROM employees", (err, res) => {
        if(err) throw err;
        console.table(res);
    })
}

//asks if the user wants to add/view/update. Should be the first question asked
function rootQuestion(){
    let question = [
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add", "View", "Update"]
        },
    ];
    
    inquirer.prompt(question).then(ans => {
        if(ans.action === "Add"){
            //call function to add stuff
            console.log("Add chosen");
        }
        else if(ans.action === "View"){
            //call function to view stuff
            console.log("View chosen");
        }
        else{
            //call function to update stuff
            console.log("Update chosen");
        }
        connect();
    });
}

rootQuestion();