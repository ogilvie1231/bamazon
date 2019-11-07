// pulling in mySQL
var mysql = require('mysql');
// pulling in
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cervelo05',
    database: 'bamazon'
});

start();

function start() {
    inquirer.prompt([{
        name: 'action',
        message: 'Please select your action',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Update inventory', 'Add New Product', 'Delete Product', 'Exit']
    }]).then(function(answer) {
        if (answer.action === 'View Products for Sale') {

            connection.query(
                'SELECT * FROM products',
                function(err, res) {
                    if (err) throw err;
                    console.table(res)
                    start();
                });
        } else if (answer.action === 'View Low Inventory') {
            // console.log('you selected "View Low Inventory')
            connection.query('SELECT * FROM products WHERE stock < 10', function(err, res) {
                if (res.length) {
                    console.table(res)
                } else console.log("All products are fully stocked!")
            });
            start();

        } else if (answer.action === 'Update inventory') {
            updateStock();

        } else if (answer.action === 'Add New Product') {
            addNew();

        } else if (answer.action === 'Delete Product') {
            deleteItem();

        } else {
            connection.end();
        }
    });
}

function display() {
    connection.query(
        'SELECT * FROM products',
        function(err, res) {
            if (err) throw err;
            console.table(res)
                // start();
        });
}

function addNew(name, id, department, price, stock) {
    inquirer.prompt([{
                name: 'productName',
                type: 'input',
                message: 'What is the name of the product?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'What department?',
                choices: ['candy', 'clothing']
            },
            {
                name: 'price',
                type: 'input',
                message: 'What is the retail price?',
                validate: function(value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'stock',
                type: 'input',
                message: 'What is the quantity?',
                validate: function(value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            var name = answer.productName;
            var dep = answer.department;
            var price = answer.price;
            var stock = answer.stock;
            connection.query('INSERT INTO products SET ?', {
                product_name: name,
                department_name: dep,
                price: price,
                stock: stock

            }, function(err) {
                if (err) throw err;
                console.log('You have entered a new product!')
            });
            start();
        });
};


function updateStock() {
    inquirer.prompt([{
                name: 'whatID',
                message: 'What is the ID of the product you would like to update?',
                type: 'input',
                validate: function(value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'enterQTY',
                message: 'How many would you like to enter?',
                type: 'input',
                validate: function(value) {
                    if (!isNaN(value)) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(ans) {
            var qtyUpdate = ans.enterQTY;
            var id = ans.whatID;
            connection.query('SELECT * FROM products',
                function(err, res) {
                    if (err) throw err;
                    var newQTY = res[0].stock + parseInt(qtyUpdate)
                    newStock(newQTY, id)

                }
            )
        })
};

function newStock(newQTY, id) {
    connection.query(
        'UPDATE products SET stock = ? WHERE item_id =?', [newQTY, id],
        function(err, res) {
            if (err) throw err;
        }
    )
    start();
}

function deleteItem() {
    display();
    console.log('\n')
    inquirer.prompt([{
            type: 'input',
            message: 'What is the ID of the item you would like to delete?',
            name: 'idDelete'
        }])
        .then(function(ans) {

            deleteQuery(ans.idDelete);
        })
}

function deleteQuery(id) {
    connection.query(
        'DELETE FROM products WHERE item_id = ?', [id],
        function(err, res) {
            if (err) throw err;
        }
    )
    start();
}