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
    rootQuestion();
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
            add();
        }
        else if(ans.action === "View"){
            //call function to view stuff
            console.log("View chosen");
        }
        else{
            //call function to update stuff
            console.log("Update chosen");
        }
    });
}

function add(){
  let question = [
    {
      name: "selection",
      type: "list",
      message: "What would you like to add?",
      choices: ["New Employee", "New Role", "New Department"]
    }
  ];
  
  inquirer.prompt(question).then(ans => {
    if(ans.selection === "New Employee"){
      addEmployee();
    }
    else if(ans.selection === "New Role"){
      //call addRole function
    }
    else{
      //call addDepartment function
    }
  })
}

function addEmployee(){
  connection.query("SELECT * FROM roles", (err, res) => {
    if(err) throw err;
    //console.log(res);
    let roleList = [];
    res.forEach(role => {
      roleList.push(role.title);
    });
    
    let questions = [
      {
        name: "first",
        message: "New employee's first name:"
      },
      {
        name: "last",
        message: "New employee's last name:"
      },
      {
        name: "role",
        message: "New employee's role:",
        type: "list",
        choices: roleList
      },
      {
        name: "manager",
        message: "New employee's manager:",
        type: "list",
        choices: ["N/A"]
      }
    ];
    
    inquirer.prompt(questions).then(ans => {
      let roleId = -1; //meaning it's an invalid role
      for(let i=0; i<roleList.length; i++){
        if(roleList[i] === ans.role){
          roleId = i + 1;
          break;
        }
      }
      
      connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [ans.first, ans.last, roleId, null], (err, res) => { 
        console.log(`${ans.first} ${ans.last} added to employees.`);
        displayEmployees();
      });
    });
  });
};


connect();