const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(error) {
    if (error) throw (error);
    console.log("Welcome to BAMazon! You're connected, Manager " + connection.threadId + ".");
    promptManager();
});

function promptManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory Products", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(answer) {
        if (answer.options == "View Products for Sale") {
            showProducts();
        }
        else if (answer.options == "View Low Inventory Products") {
            showLowInventory();
        }
        else if (answer.options == "Add to Inventory") {
            addInventory();
        }
        else if (answer.options == "Add New Product") {
            addProducts();
        }
        else {
            console.log("How did you get here?? Something went wrong, dude.");
        }
    });
};

function showProducts() {
    console.log("Our current items on offer are listed below.");
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw (error);
        for (let record in results) {
            let product = results[record];
            console.log("| ID: " + product.item_id + "   | Name: " + product.product_name + "   | Dept.: " + product.department_name + "    | Price: " + product.price + "   | Stock: " + product.stock_quantity);
        }
        console.log("==========================================================================");
        promptManager();
    });
};

function showLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(error, results) {
        if (error) throw (error);
        for (let record in results) {
            let product = results[record];
            console.log("These items are flagged as being low on stock. Please consider restocking soon.");
            console.log("| ID: " + product.item_id + "   | Name: " + product.product_name + "   | Dept.: " + product.department_name + "    | Price: " + product.price + "   | Stock: " + product.stock_quantity);
        }
        console.log("==========================================================================");
        promptManager();
    });
}

function addInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "yesno",
            message: "Would you like to add more inventory to a product?",
            choices: ["Yes", "No"]
        }
    ]).then(function(answer) {
        if (answer.yesno == "Yes") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "getID",
                    message: "What is the ID of the item you'd like to update the quantity of?"
                },
                {
                    type: "input",
                    name: "amount",
                    message: "How many of the item would you like to add to the stock?"
                }
            ]).then(function(response) {
                connection.query("SELECT stock_quantity FROM products WHERE item_id = " + response.getID, function(error, result) {
                    var newquantity = parseInt(result[0].stock_quantity) + parseInt(response.amount);
                    connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newquantity
                    }, {
                    item_id: response.getID
                    }], function(error, results) {
                    if (error) throw (error);
                    });
                    continueWorking();
                })
            });
        }
        else if (answer.yesno == "No") {
            promptManager();
        }
        else {
            console.log("What're you doing here? You're not supposed to be here!");
        }
    });
}

function addProducts() {
    inquirer.prompt([
        {
            type: "list",
            name: "addorno",
            message: "Would you like to add a product to the inventory?",
            choices: ["Yes", "No"]
        }
    ]).then(function(answer) {
        if (answer.addorno == "Yes") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "product",
                    message: "What is the name of the product you'd like to add?"
                },
                {
                    type: "input",
                    name: "department",
                    message: "What is the department you'd like to add the item to?"
                },
                {
                    type: "input",
                    name: "price",
                    message: "What is the price of the item you're adding?"
                },
                {
                    type: "input",
                    name: "stock",
                    message: "How much stock do you have of the item?"
                }
            ]).then(function(response) {
                connection.query("INSERT INTO products SET ?", {
                    product_name: response.product,
                    department_name: response.department,
                    price: response.price,
                    stock_quantity: response.stock
                }, function(error, result) {
                    if (error) throw (error);
                    console.log("Good work! " + result.affectedRows + " has been added to the database.");
                })
                continueWorking();
            });
        }
        else if (answer.addorno == "No") {
            promptManager();
        }
        else {
            console.log("Something went wrong! How'd you end up in this thread?")
        }
    });
}

function continueWorking() {
    inquirer.prompt([
        {
            type: "list",
            name: "stayORGo",
            message: "Would you like to continue working?",
            choices: ["Continue Working", "Exit BAMazon"]
        }
    ]).then(function(answer) {
        if (answer.stayORGo == "Continue Working") {
            promptManager();
        }
        else if (answer.stayORGo == "Exit BAMazon") {
            console.log("Thank you for working with BAMazon. Please return again soon.");
            connection.end();
        }
    });
}