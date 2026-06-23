const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SmartShop Backend Running");
});

app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT NOW()"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database connection failed"
        });
    }
});

const PORT = 5000;

// CREATING PRODUCTS API

app.get("/products", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch products"
        });
    }
});

//CREATING A POST ROUTE

app.post("/products", async (req, res) => {

    try {

        const { name, price, image } = req.body;

        const result = await pool.query(

            `INSERT INTO products
            (name, price, image)
            VALUES ($1, $2, $3)
            RETURNING *`,

            [name, price, image]

        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to add product"
        });
    }
});

// DELETE PRODUCT

app.delete("/products/:id", async (req, res) => {

    try{

        const { id } = req.params;

        await pool.query(

            "DELETE FROM products WHERE id = $1",

            [id]

        );

        res.json({
            message: "Product deleted"
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            error: "Failed to delete product"
        });
    }
});


// UPDATE PRODUCT

app.put("/products/:id", async (req, res) => {

    try{

        const { id } = req.params;

        const {
            name,
            price,
            image
        } = req.body;

        const result =
            await pool.query(

                `UPDATE products
                 SET name = $1,
                     price = $2,
                     image = $3
                 WHERE id = $4
                 RETURNING *`,

                [name, price, image, id]
            );

        res.json(result.rows[0]);

    }catch(error){

        console.error(error);

        res.status(500).json({
            error:
            "Failed to update product"
        });
    }
});

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});


//CHECKOUT ROUTE (POST ORDER)

app.post("/checkout", async (req, res) => {

    const {
        customer_name,
        customer_email,
        customer_phone,
        payment_method,
        items
    } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({
            message: "Cart is empty"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let total = 0;

        for (let item of items) {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            total += price * quantity;
        }

       const orderResult = await client.query(
    `INSERT INTO orders
    (customer_name, customer_phone, customer_email, total_amount, payment_method, status, created_at)
    VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
    RETURNING id`,
    [customer_name, customer_phone, customer_email, total, payment_method]
);

        const orderId = orderResult.rows[0].id;

        for (let item of items) {
            await client.query(
                `INSERT INTO order_items
                (order_id, product_id, quantity, price_at_purchase)
                VALUES ($1, $2, $3, $4)`,
                [
                    orderId,
                    null,
                    item.quantity,
                    item.price
                ]
            );
        }

        await client.query("COMMIT");

        res.json({
            message: "Order placed successfully",
            order_id: orderId,
            total
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Checkout failed",
            error: error.message
        });

    } finally {
        client.release();
    }
});


// =====================================
// 📦 GET ALL ORDERS (ADMIN DASHBOARD)
// =====================================
app.get("/orders", async (req, res) => {

    try {
        // Get all orders from database (newest first)
        const ordersResult = await pool.query(
            `SELECT * FROM orders ORDER BY id DESC`
        );

        res.json(ordersResult.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});

// =====================================
// 🧾 GET SINGLE ORDER DETAILS
// =====================================
app.get("/orders/:id", async (req, res) => {

    try {
        const { id } = req.params;

        // Get order info
        const orderResult = await pool.query(
            `SELECT * FROM orders WHERE id = $1`,
            [id]
        );

        // Get items in that order
        const itemsResult = await pool.query(
            `SELECT * FROM order_items WHERE order_id = $1`,
            [id]
        );

        res.json({
            order: orderResult.rows[0],
            items: itemsResult.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch order details",
            error: error.message
        });
    }
});


// =====================================
// 📊 UPDATE ORDER STATUS (ADMIN)
// =====================================
app.put("/orders/:id/status", async (req, res) => {

    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate allowed statuses (important)
        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        // Update order status in database
        const result = await pool.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        res.json({
            message: "Order status updated",
            order: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
});


// =====================================
// 🧾 GET SINGLE ORDER (FOR TRACKING PAGE)
// =====================================
app.get("/orders/:id", async (req, res) => {

    try {
        const { id } = req.params;

        // Get order
        const order = await pool.query(
            "SELECT * FROM orders WHERE id = $1",
            [id]
        );

        // Get order items
        const items = await pool.query(
            "SELECT * FROM order_items WHERE order_id = $1",
            [id]
        );

        res.json({
            order: order.rows[0],
            items: items.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch order"
        });
    }
});