var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cervelo05',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log('thread id ' + connection.threadId)
    readItems();
    // itemSales();
    // connection.end();
});

function readItems() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log('Item ID: ', res[i].item_id);
            console.log('Product: ' + res[i].product_name);
            console.log('Department: ', res[i].department_name);
            console.log('Price: ', res[i].price);
            console.log('Stock: ', res[i].stock);
            console.log('\n');
        }
    })
};

function itemSales(item) {
    inquirer.prompt([{
            name: 'buy',
            type: 'input',
            message: 'what is the id of the item you would like to buy?'
        }, {
            name: 'quantity',
            type: 'input',
            message: 'how many would you like to buy?',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }])
        .then(function(answer) {
            console.log('answer.buy: ' + answer.buy)
                // connection.query(
                //     'SELECT * FROM bamazon WHERE item_id=?', [answer.buy],
                //     function(err, res) {
                //         if (err) throw err;
                //         console.log(res)
                //     })
        })

};