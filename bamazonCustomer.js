var mysql = require("mysql");
var prompt = require('prompt');
var purchasedItemArr = []

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "*******",
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
				description: 'What is the id of the product you would like to buy?',
				type: 'integer',
				required: true
			},
			question2: {
				description: 'How many would you like to purchase?',
				type: 'integer',
				required: true
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
			if (err) console.log('Item does not exist');

			if(results[0].stock_quantity < purchasedItemArr[0].quantity) {
				console.log('Selected amount is more than stock available')
				connection.end()
			}
			else if(results[0].stock_quantity >= purchasedItemArr[0].quantity) {
				console.log(purchasedItemArr[0].quantity + ' items purchased');
				console.log(results[0].product_name + ' at $' + results[0].price);
				var totalCost = purchasedItemArr[0].quantity * results[0].price
				console.log('Total sale cost: $' + totalCost);

				var updatedQuantity = results[0].stock_quantity - purchasedItemArr[0].quantity;

				connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [updatedQuantity, purchasedItemArr[0].itemID], function(err, results) {
					if (err) throw err;
					console.log('Purchase Complete! Thank you for shopping with us!');
					connection.end()
				})
			}

		})
	})

}


