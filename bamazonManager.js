var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cervelo05',
    database: 'bamazon'
});

// connection.connect(function(err) {
//     if (err) throw err;

// });

inquirer.prompt([{
    name: 'action',
    message: 'Please select your action',
    type: 'list',
    choices: ['View Products for Sale', 'View Low Inventory', 'Update inventory', 'Add New Product']
}]).then(function(answer) {
    if (answer.action === 'View Products for Sale') {
        // console.log('you have selected "View Products for Sale"')
        connection.query(
            'SELECT * FROM products',
            function(err, res) {
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    console.log('Item ID: ', res[i].item_id);
                    console.log('Product: ' + res[i].product_name);
                    console.log('Department: ', res[i].department_name);
                    console.log('Price: ', res[i].price);
                    console.log('Stock: ', res[i].stock);
                    console.log('\n');
                    // connection.end();
                };
            });
    } else if (answer.action === 'View Low Inventory') {
        console.log('you selected "View Low Inventory')
            // show items with less than 3 in stock. If none, log "No items with stock below 3"
    } else if (answer.action === 'Update inventory') {
        // connection.query(
        //     'INSERT INTO',function(err, res) {
        //     }
        // )
        console.log('You selected "Update inventory"')
    } else if (answer.action === 'Add New Product') {
        inquirer.prompt([{
                    name: 'productName',
                    type: 'input',
                    message: 'What is the name of the product?'
                },
                {
                    name: 'idNumber',
                    type: 'input',
                    message: 'What is the ID for the new item?',
                    validate: function(value) {
                        if (!isNaN(value)) {
                            return true;
                        }
                        return false;
                    }
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
                console.log('Product: ' + answer.productName);
                console.log('Item ID: ' + answer.idNumber);
                console.log('Department: ' + answer.department);
                console.log('Price: ' + answer.price);
                console.log('Stock: ' + answer.stock);
                // connection.query()
                'INSERT INTO products SET item_id = ? SET product_name = ? SET department_name = ? SET price = ? SET stock = ?', [answer.productName, answer.idNumber, answer.department, answer.price, answer.stock]
            })
    }
});


// function listItems(callback) {
//     connection.query('What to do', function(err, res) {
//         if (err) throw err;


//     });
// };

// listItems();