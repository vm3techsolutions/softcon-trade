const db = require("../../config/db");

// Create Order
const createOrder = (req, res) => {
    const { user_id, items, total_amount, payment_method, transaction } = req.body;
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
    }

    // Start transaction
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: "DB error" });

        // Insert order
        db.query(
            "INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, 'pending', ?)",
            [user_id, total_amount, payment_method],
            (err, orderResult) => {
                if (err) {
                    db.rollback(() => { });
                    return res.status(500).json({ error: "Failed to create order" });
                }
                const order_id = orderResult.insertId;

                // Insert order items
                const orderItemsData = items.map(item => [
                    order_id,
                    item.product_id,
                    item.quantity,
                    item.unit_price,
                ]);
                db.query(
                    "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?",
                    [orderItemsData],
                    (err) => {
                        if (err) {
                            db.rollback(() => { });
                            return res.status(500).json({ error: "Failed to add order items" });
                        }

                        // Insert transaction if present
                        if (transaction) {
                            db.query(
                                "INSERT INTO transactions (order_id, transaction_id, status, amount, payment_gateway) VALUES (?, ?, ?, ?, ?)",
                                [
                                    order_id,
                                    transaction.transaction_id,
                                    transaction.status,
                                    transaction.amount,
                                    transaction.payment_gateway,
                                ],
                                (err) => {
                                    if (err) {
                                        db.rollback(() => { });
                                        return res.status(500).json({ error: "Failed to add transaction" });
                                    }
                                    db.commit();
                                    res.json({ success: true, order_id });
                                }
                            );
                        } else {
                            db.commit();
                            res.json({ success: true, order_id });
                        }
                    }
                );
            }
        );
    });
};

// Get all orders for a user
const getOrdersByUser = (req, res) => {
    const { user_id } = req.params;
    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [user_id],
        (err, orders) => {
            if (err) return res.status(500).json({ error: "DB error" });
            res.json(orders);
        }
    );
};

// Get order details by order_id (with items and transaction)
const getOrderDetails = (req, res) => {
    const { order_id } = req.params;
    db.query(
        "SELECT * FROM orders WHERE id = ?",
        [order_id],
        (err, orderRows) => {
            if (err || orderRows.length === 0)
                return res.status(404).json({ error: "Order not found" });

            const order = orderRows[0];
            db.query(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order_id],
                (err, items) => {
                    if (err) return res.status(500).json({ error: "DB error" });

                    db.query(
                        "SELECT * FROM transactions WHERE order_id = ?",
                        [order_id],
                        (err, transactions) => {
                            if (err) return res.status(500).json({ error: "DB error" });

                            res.json({
                                ...order,
                                items,
                                transactions,
                            });
                        }
                    );
                }
            );
        }
    );
};

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderDetails,
};