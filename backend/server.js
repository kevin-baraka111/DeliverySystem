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

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});