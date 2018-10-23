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
    console.log("Welcome to BAMazon! You're connected, Customer " + connection.threadId + ".");
    showProducts();
});

function showProducts() {
    console.log("Our current items on offer are listed below.");
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw (error);
        for (let record in results) {
            let product = results[record];
            console.log("| ID: " + product.item_id + "   | Name: " + product.product_name + "   | Dept.: " + product.department_name + "    | Price: " + product.price);
        }
        console.log("==========================================================================");
        buyProducts();
    });
};

function buyProducts() {
    inquirer.prompt([
        {
            type: "input",
            name: "productID",
            message: "What is the ID of the item you'd like to buy?"
        },
        {
            type: "input",
            name: "amount",
            message: "How many of the item would you like to buy?"
        }
    ]).then(function(getID) {
        connection.query("SELECT stock_quantity, price FROM products WHERE item_id = " + getID.productID, function(error, results) {
            if (error) throw (error);
            if (getID.amount <= results[0].stock_quantity) {
                var cost = getID.amount * results[0].price;
                var newquantity = results[0].stock_quantity - getID.amount;
                console.log("Your total comes to $" + cost);
                console.log("==========================================================================");
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newquantity,
                }, {
                    item_id: getID.productID
                }], function(error, results) {
                    if (error) throw (error);
                });
                stayORGo();
            }
            else {
                console.log("Insufficient quantity! Please revise your amount.");
                showProducts();
            }
        })
    })
}

function stayORGo() {
    inquirer.prompt([
        {
            type: "list",
            name: "stayORGo",
            message: "Would you like to continue shopping?",
            choices: ["Continue Shopping", "Exit BAMazon"]
        }
    ]).then(function(answer) {
        if (answer.stayORGo == "Continue Shopping") {
            showProducts();
        }
        else if (answer.stayORGo == "Exit BAMazon") {
            console.log("Thank you for shopping with BAMazon. Please return again soon.");
            connection.end();
        }
    })
}