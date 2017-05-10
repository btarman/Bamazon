var mysql = require("mysql");
var prompt = require('prompt');
var colors = require('colors');
var updateInventoryArr = [];
var newProductArr = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: " ",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
});

var managerOptions = {
		properties: {
			options: {
				description: colors.blue('Key in one of the following options: 1) View products for sale 2) View low inventory 3) Add to inventory 4) Add new product')
			},
		},
	};
prompt.start();
prompt.get(managerOptions, function(err, results) {
	if (results.options == 1) {
		viewProducts()
	}
	else if (results.options == 2) {
		viewLowInventory()
	}
	else if (results.options == 3) {
		addInventory()
	}
	else if (results.options == 4) {
		addNewProduct()
	} else {
		console.log("Not a valid choice");
		connection.end()
	}
});

var viewProducts = function() {
	connection.query('SELECT * FROM products', function(err, results) {
		if(err) throw err;
		console.log('');
		console.log('Products For Sale'.underline.red);
		console.log('');
		for (var i = 0; i < results.length; i++) {
			console.log('ID:' +results[i].item_id + '|' + 'Product:' + results[i].product_name + '|' + 'Dept:' + results[i].department_name + '|' + 'Price: $' + results[i].price + '|' + 'Quantity:' + results[i].stock_quantity + '|');

		}
		connection.end();
	});
}

var viewLowInventory = function() {
	connection.query('SELECT * FROM products WHERE stock_quantity < 15', function(err, results) {
		console.log('');
		console.log('Products With Low Inventory'.underline.red);
		console.log('');
		for (var i = 0; i < results.length; i++) {
			console.log('ID:' +results[i].item_id + '|' + 'Product:' + results[i].product_name + '|' + 'Dept:' + results[i].department_name + '|' + 'Price: $' + results[i].price + '|' + 'Quantity:' + results[i].stock_quantity + '|');
		}
		connection.end();
	})
}
var addInventory = function() {
	var updateInventory = {
			properties: {
				inventoryID: {
					description: colors.blue('What is the id of the product you want to update?')
				},
				inventoryAmount: {
					description: colors.blue('How much would you like to add to the inventory?')
				}
			},
		}
	prompt.start()
	prompt.get(updateInventory, function(err, results) {
		var newInventory = {
				inventoryID: results.inventoryID,
				inventoryAmount: results.inventoryAmount,
		}
		updateInventoryArr.push(newInventory)
		// var updatedInvenAmount = results[0].stock_quantity + updateInventoryArr[0].inventoryAmount;
		connection.query('UPDATE products SET stock_quantity = (stock_quantity + ?) WHERE item_id = ?', [updateInventoryArr[0].inventoryAmount, updateInventoryArr[0].inventoryID], function(err, results) {
			if(err) throw err;
			connection.query('SELECT * FROM products WHERE item_id = ?', updateInventoryArr[0].inventoryID, function(err, results) {
				console.log('');
				console.log('Updated quantity for #' + updateInventoryArr[0].inventoryID + ': ' + results[0].product_name + ' is ' + results[0].stock_quantity);
				connection.end()
			})
		})
	})

}
var addNewProduct = function() {
	var addProduct = {
			properties: {
				productName: {
					description: colors.blue('What is the name of the new product?')
				},
				deptName: {
					description: colors.blue('What is the department name for the new product?')
				},
				price: {
					description: colors.blue('What is the price of the product?')
				},
				quantity: {
					description: colors.blue('What is the quantity of the product?')
				}
			}
		}
	prompt.start();
	prompt.get(addProduct, function(err, results) {
		var newProduct = {
				productName: results.productName,
				deptName: results.deptName,
				price: results.price,
				quantity: results.quantity,
		};
		newProductArr.push(newProduct);

		connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);', [newProductArr[0].productName, newProductArr[0].deptName, newProductArr[0].price, newProductArr[0].quantity], function(err, results) {
			if(err) throw err;
			console.log('');
			console.log('New Item Added!'.underline.red);
			console.log('');
			connection.query('SELECT * FROM products', function(err, results) {
				for (var i = 0; i < results.length; i++) {
					console.log('ID:' +results[i].item_id + '|' + 'Product:' + results[i].product_name + '|' + 'Dept:' + results[i].department_name + '|' + 'Price: $' + results[i].price + '|' + 'Quantity:' + results[i].stock_quantity + '|');
				}
				connection.end();
			})
		})
	})
}

