const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "manage_db",
});

function connect() {
	connection.connect(function (err) {
		if (err) {
			console.error("error connecting: " + err.stack);
			return;
		}

		console.log("connected as id " + connection.threadId);
		rootQuestion();
	});
}

function displayEmployees() {
	connection.query("SELECT * FROM employees", (err, res) => {
		if (err) throw err;
		console.table(res);
		console.log("Returning to root menu...");
		rootQuestion();
	});
}

function displayRoles() {
	connection.query("SELECT * FROM roles", (err, res) => {
		if (err) throw err;
		console.table(res);
		console.log("Returning to root menu...");
		rootQuestion();
	});
}

function displayDepartments() {
	connection.query("SELECT * FROM departments", (err, res) => {
		if (err) throw err;
		console.table(res);
		console.log("Returning to root menu...");
		rootQuestion();
	});
}

//asks if the user wants to add/view/update. Should be the first question asked
function rootQuestion() {
	let question = [
		{
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: ["Add", "View", "Update"],
		},
	];

	inquirer.prompt(question).then((ans) => {
		if (ans.action === "Add") {
			add();
		} else if (ans.action === "View") {
			//call function to view stuff
			console.log("View chosen");
		} else {
			//call function to update stuff
			console.log("Update chosen");
		}
	});
}

/**
 *
 * Functions for adding to the database
 *
 */

function add() {
	let question = [
		{
			name: "selection",
			type: "list",
			message: "What would you like to add?",
			choices: ["New Employee", "New Role", "New Department"],
		},
	];

	inquirer.prompt(question).then((ans) => {
		if (ans.selection === "New Employee") {
			addEmployee();
		} else if (ans.selection === "New Role") {
			addRole();
		} else {
			addDepartment();
		}
	});
}

function addEmployee() {
	connection.query("SELECT * FROM roles", (err, res) => {
		if (err) throw err;
		//console.log(res);
		let roleList = [];
		res.forEach((role) => {
			roleList.push(role.title);
		});

		let questions = [
			{
				name: "first",
				message: "New employee's first name:",
			},
			{
				name: "last",
				message: "New employee's last name:",
			},
			{
				name: "role",
				message: "New employee's role:",
				type: "list",
				choices: roleList,
			},
			{
				name: "manager",
				message: "New employee's manager:",
				type: "list",
				choices: ["N/A"],
			},
		];

		inquirer.prompt(questions).then((ans) => {
			let roleId = -1; //meaning it's an invalid role
			for (let i = 0; i < roleList.length; i++) {
				if (roleList[i] === ans.role) {
					roleId = i + 1;
					break;
				}
			}

			connection.query(
				"INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
				[ans.first, ans.last, roleId, null],
				(err, res) => {
					console.log(`${ans.first} ${ans.last} added to employees.`);
					displayEmployees();
				}
			);
		});
	});
}

function addRole() {
	connection.query("SELECT * FROM departments", (err, res) => {
		if (err) throw err;
		//console.log(res);

		//Note: res contains objects with an id and name for each department
		let depList = [];
		res.forEach((dep) => {
			depList.push(dep.name);
		});

		let questions = [
			{
				name: "title",
				message: "New role's title:",
			},
			{
				name: "salary",
				message: "New role's salary:",
			},
			{
				name: "department",
				message: "New role's department:",
				type: "list",
				choices: depList,
			},
		];

		inquirer.prompt(questions).then((ans) => {
			let newQuery =
				"INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
			let depId = -1; //default to an invalid id in case something goes wrong
			//console.log(res);
			for (let i = 0; i < res.length; i++) {
				//find the department's id
				let dep = res[i];
				if (dep.name === ans.department) {
					depId = dep.id;
				}
			}
			connection.query(
				newQuery,
				[ans.title, ans.salary, depId],
				(err, res) => {
					console.log(`${ans.title} added to roles.`);
					displayRoles();
				}
			);
		});
	});
}

function addDepartment() {
	let questions = [
		{
			name: "name",
			message: "New department's name:",
		},
	];

	inquirer.prompt(questions).then((ans) => {
		let newQuery = "INSERT INTO departments (name) VALUE (?)";
		connection.query(newQuery, [ans.name], (err, res) => {
			console.log(`${ans.name} added to departments.`);
			displayDepartments();
		});
	});
}

connect();
