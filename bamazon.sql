CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(7,2) NULL,
stock_quantity INT(10) NULL,
PRIMARY KEY(item_id)
)
SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Drum Sticks', 'Music', 10.00, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Basketball', 'Sports', 25.00, 80);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Running Shoes', 'Clothing', 75.00, 60);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Drum Pedal', 'Music', 115.00, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Baseball Glove', 'Sports', 55.00, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Pea Coat', 'Clothing', 150.00, 25);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Computer Mouse', 'Electronics', 30.00, 200);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Floor Lamp', 'Home Goods', 45.00, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Guitar Tuner', 'Music', 95.00, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Coffee Table', 'Home Goods', 200.00, 5);


