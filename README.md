# BAMazon
MySQL &amp; NodeJS

Welcome to BAMazon!

This is a simple database CLI application that allows a user to figuratively buy products off of the Amazon offshoot (probably soon-to-be-trademarked) BAMazon. The program starts by entering "node bamazonCustomer.js" into the command line. The user is then shown a list of products.

screenshots\bamazon_main.png

The user is then prompted to enter the ID of the item they'd like to buy, as well as the quantity. If there is enough stock, the user is given a price. 

screenshots\bamazon_buying.png

If there is not enough quantity, the user is told there is an insufficient amount of inventory and prompted to enter a lower amount. 

After purchasing an item, the user is given the option of continuing to shop or exiting. If they continue to shop, they're put through the buying process again.

screenshots\bamazon_continuedbuying.png

If the user chooses to exit, they're given a parting message and the program is ended.

screenshots\bamazon_exit.png

The MySQL database that's being queried can be seen here:

screenshots\bamazondb_startingquantity.png

After making the previous purchases, the program updates the quantities in the database, which can be seen here:

screenshots\bamazondb_endquantity.png

Apart from the bamazonCustomer.js, there's also the bamazonManager.js application. To start, enter "node bamazonManager.js" into the command line. The user will then be prompted with a list of actions that can be taken.

screenshots\bamazon_manager.png

If the user chooses to show inventory, the application simply shows the user the inventory in the database. If the user chooses to show items with low inventory, the program will show all items with inventory fewer than 5 items.

screenshots\manager_lowproduct.png

The Add Inventory option allows the user to add more stock to any item they choose using the ID of the item.

screenshots\manager_addinventory.png

And finally the Add Product option allows the user to add a completely new product to the database. It prompts the user to give a name, department, price, and amount of stock for the product and then adds all of that to the database. In the end, the database itself is updated. At any time a user can choose to not go through with the action which will loop them back to the starting action. There's also a simple continue or quit function at the end, which will allow the user to either easily access a new action, or exit the application, which closes the connection to the database.

Thank you for using BAMazon!