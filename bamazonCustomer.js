var mysql = require("mysql");
var prompt = require('prompt');
var colors = require('colors');
var purchasedItemArr = []

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

connection.query('SELECT * FROM products', function(err, results) {
	if(err) throw err;
	for(var i = 0;  i < results.length; i++ ) {
		console.log('ID:' +results[i].item_id + '|' + 'Product:' + results[i].product_name + '|' + 'Price: $' + results[i].price + '|');
	}
	purchaseItem();
})
var purchaseItem = function() {
	var schema = {
		properties: {
			question1: {
				description: colors.blue('What is the id of the product you would like to buy?')
			},
			question2: {
				description: colors.blue('How many would you like to purchase?'),
			}
		}
	};
	prompt.start()

	prompt.get(schema, function(err, results) {
		var custBuy = {
			itemID: results.question1,
			quantity: results.question2
		};

		purchasedItemArr.push(custBuy);

		connection.query('SELECT * FROM products WHERE item_id=?', purchasedItemArr[0].itemID, function(err, results) {
			if (err) console.log('Item does not exist'.underline.red);

			if(results[0].stock_quantity < purchasedItemArr[0].quantity) {
				console.log('Selected amount is more than stock available'.underline.red)
				connection.end()
			}
			else if(results[0].stock_quantity >= purchasedItemArr[0].quantity) {
				console.log((purchasedItemArr[0].quantity + ' items purchased').underline.green);
				console.log((results[0].product_name + ' at $' + results[0].price).underline.green);
				var totalCost = purchasedItemArr[0].quantity * results[0].price
				console.log(('Total sale cost: $' + totalCost).underline.green);

				var updatedQuantity = results[0].stock_quantity - purchasedItemArr[0].quantity;

				connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [updatedQuantity, purchasedItemArr[0].itemID], function(err, results) {
					if (err) throw err;
					console.log('Purchase Complete! Thank you for shopping with us!'.underline.red);
					connection.end()
				})
			}

		})
	})

}


