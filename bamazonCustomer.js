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
    readItems(function() {
        itemSales();
    });
    // connection.end();
});

function readItems(callback) {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.table(res)
        callback();
    })
};

function itemSales(item) {
    inquirer.prompt([{
            name: 'id',
            type: 'input',
            message: 'what is the id of the item you would like to buy?'
        }, {
            name: 'quantity',
            type: 'input',
            message: 'how many would you like to buy?',
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }])
        .then(function(answer) {
            connection.query(
                'SELECT * FROM products WHERE item_id=?', [answer.id],
                function(err, res) {
                    if (err) throw err;
                    var requestedQTY = answer.quantity;
                    var id = res[0].item_id - 1;
                    var stockQTY = res[0].stock;
                    console.log('answer: ' + answer.id)
                    console.log('answer.quantity: ', answer.quantity)
                    console.log('stock: ' + stockQTY)
                    if (requestedQTY <= stockQTY) {
                        var newQTY = stockQTY - requestedQTY
                        stockUpdate(answer.id, newQTY)
                    } else {
                        console.log('There is not enough inventory to fulfill your order.')
                    }
                });
        })
};

function stockUpdate(id, qty) {
    connection.query(
        'UPDATE products SET stock = ? WHERE item_id = ?', [qty, id],
        function(err) {
            readItems(function() {
                itemSales();
            });
        });
};