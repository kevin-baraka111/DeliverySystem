// GET CART FROM LOCAL STORAGE

console.log("APP JS LOADED");


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ADD TO CART FUNCTION

function addToCart(productId, productName, productPrice){


     // CHECK IF PRODUCT EXISTS

    const existingProduct = cart.find(
        item => item.productId === productId
    );

   
    // IF EXISTS INCREASE QUANTITY

    if(existingProduct){
        existingProduct.quantity += 1;
    } else 
        
        
         // CREATE NEW PRODUCT
         {
        cart.push({
            productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    // SAVE TO LOCAL STORAGE

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(productName + " added to cart!");
}


// DISPLAY CART

function displayCart(){

    const cartItems = document.getElementById("cart-items");

    const totalPrice = document.getElementById("total-price");

    // STOP IF NOT ON CART PAGE

    if(!cartItems){
        return;
    }

    // CLEAR CONTENT

    cartItems.innerHTML = "";

    let total = 0;

    // LOOP THROUGH ITEMS

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <div>
                <h3>${item.name}</h3>

                <p>Ksh ${item.price}</p>

                <p>Quantity: ${item.quantity}</p>
            </div>

            <div>

                <button onclick="decreaseQuantity(${index})">
                    -
                </button>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

                <button onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

        </div>

        `;
    });

    // UPDATE TOTAL

    totalPrice.innerHTML = `Total: Ksh ${total}`;
}


// INCREASE QUANTITY

function increaseQuantity(index){

    cart[index].quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


// DECREASE QUANTITY

function decreaseQuantity(index){

    if(cart[index].quantity > 1){

        cart[index].quantity -= 1;

    }else{

        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


// REMOVE ITEM

function removeItem(index){

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


// RUN FUNCTION

displayCart();

// CHECKOUT FORM

const checkoutForm = document.getElementById("checkout-form");

if(checkoutForm){

    checkoutForm.addEventListener("submit", function(event){

        event.preventDefault();

alert("Proeeding to payment...");

// CLEAR CART

//REDIRECT

window.location.href = "payment.html";

    });
}

// REGISTER SYSTEM

const registerForm = document.getElementById("register-form");

if(registerForm){

    registerForm.addEventListener("submit", function(event){

        event.preventDefault();

        // GET VALUES

        const name = document.getElementById("register-name").value;

        const email = document.getElementById("register-email").value;

        const password = document.getElementById("register-password").value;

        // CREATE USER OBJECT

        const user = {
            name,
            email,
            password
        };

        // SAVE USER

        localStorage.setItem("user", JSON.stringify(user));

        alert("Registration successful!");

        // REDIRECT

        window.location.href = "login.html";
    });
}

// LOGIN SYSTEM

const loginForm = document.getElementById("login-form");

if(loginForm){

    loginForm.addEventListener("submit", function(event){

        event.preventDefault();

        // GET INPUTS

        const email = document.getElementById("login-email").value;

        const password = document.getElementById("login-password").value;

        // GET SAVED USER

        const savedUser = JSON.parse(localStorage.getItem("user"));

        // VALIDATE

        if(
            savedUser &&
            email === savedUser.email &&
            password === savedUser.password
        ){

            alert("Login successful!");

            window.location.href = "products.html";

        }else{

            alert("Invalid email or password!");
        }
    });
}


// =====================================
// 🛒 REAL CHECKOUT (BACKEND)  PAYMENT SYSTEM
// =====================================

// GET FORM FIRST
const paymentForm = document.getElementById("payment-form");

// THEN USE IT
if (paymentForm) {

    paymentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const paymentMethod = document.getElementById("payment-method").value;
        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

// GET CUSTOMER DETAILS

const customerName =
document.getElementById("customer-name").value;

const customerEmail =
document.getElementById("customer-email").value;

const customerPhone =
document.getElementById("customer-phone").value;

const customerAddress =
document.getElementById("customer-address").value;

        const user = JSON.parse(localStorage.getItem("user"));

        try {
            const response = await fetch("http://localhost:5000/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    payment_method: paymentMethod,
                    items: currentCart
                })
            });

            const data = await response.json();

            localStorage.setItem("lastOrderId", data.order_id);
            localStorage.removeItem("cart");

            window.location.href = "tracking.html";

        } catch (error) {
            console.error(error);
            alert("Checkout failed");
        }
    });
}

// DELIVERY TRACKING SYSTEM

const deliveryStatus =
document.getElementById("delivery-status");

const trackingMessage =
document.getElementById("tracking-message");

if(deliveryStatus){

    const statuses = [
        "Pending",
        "Processing",
        "On The Way",
        "Delivered"
    ];

    const messages = [
        "Your order is being prepared.",
        "Your order is being processed.",
        "Your package is on the way.",
        "Order delivered successfully."
    ];

    let currentStatus = 0;

    const trackingInterval = setInterval(() => {

        currentStatus++;

        if(currentStatus < statuses.length){

            deliveryStatus.textContent =
            statuses[currentStatus];

            trackingMessage.textContent =
            messages[currentStatus];

        }else{

            clearInterval(trackingInterval);
        }

    }, 3000);
}

//CANCEL ORDER

const cancelOrder =
document.getElementById("cancel-order");

if(cancelOrder){

    cancelOrder.addEventListener("click", () => {

        const currentStatus =
        document.getElementById("delivery-status")
        .textContent;

        if(
            currentStatus === "On The Way" ||
            currentStatus === "Delivered"
        ){

            alert(
                "Order can no longer be cancelled."
            );

            return;
        }

        const confirmCancel =
        confirm(
            "Are you sure you want to cancel this order?"
        );

        if(confirmCancel){

            deliveryStatus.textContent =
            "Cancelled";

            trackingMessage.textContent =
            "Your order has been cancelled.";

            localStorage.removeItem("cart");

            cancelOrder.disabled = true;

            alert("Order cancelled successfully.");
        }
    });
}

// ADMIN DASHBOARD

const adminForm = document.getElementById("admin-form");

let adminProducts =
    JSON.parse(localStorage.getItem("adminProducts")) || [];

    let editingId = null;

// DISPLAY ADMIN PRODUCTS

async function displayAdminProducts(searchTerm = ""){

    const adminProductsContainer =
        document.getElementById("admin-products");

    if(!adminProductsContainer){
        return;
    }

    try{

        const response = await fetch(
            "http://localhost:5000/products"
        );

        const products =
            await response.json();

        adminProductsContainer.innerHTML = "";

        const filteredProducts =
            products.filter(product =>

                product.name
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
            );

        filteredProducts.forEach(product => {

            adminProductsContainer.innerHTML += `

            <div class="product-card">

                <img src="${product.image}" alt="Product">

                <h3>${product.name}</h3>

                <p>Ksh ${product.price}</p>

                <button onclick="deleteProduct(${product.id})">
                Delete
                </button>

<button onclick="editProduct(${product.id})">
                Edit
                </button>

            </div>

            `;

        });

    }catch(error){

        console.error(error);

        adminProductsContainer.innerHTML =
        "<p>Failed to load products.</p>";
    }
}


// ADD PRODUCT

if(adminForm){

    adminForm.addEventListener("submit", async function(event){

        event.preventDefault();

        // GET VALUES

        const name =
            document.getElementById("product-name").value;

        const price =
            document.getElementById("product-price").value;

        const image =
            document.getElementById("product-image").value;

        // CREATE PRODUCT OBJECT

        const product = {
            name,
            price,
            image
        };

        if(editingId){

            console.log("updtaing product", editingId);
    await fetch(

        `http://localhost:5000/products/${editingId}`,

        {
            method: "PUT",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
                product
            )
        }

    );

    editingId = null;

    document.querySelector(
        "#admin-form button"
    ).textContent =
    "Add Product";

}else{

        // PUSH PRODUCT AND UPDATING PRODUCT WITHOUT DUPLICATING**

        try {

    const response = await fetch(
        "http://localhost:5000/products",
        {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify(product)
        }
    
    );

    const data =
        await response.json();

    console.log(data);

} catch(error){

    console.error(error);

    alert("Failed to save product");
}
}
        // REFRESH DISPLAY

        displayAdminProducts();
        updateDashboard();

        // CLEAR FORM

        adminForm.reset();
    });
}


//EDIT PRODUCT

async function editProduct(id){

    try{

        const response = await fetch(
            "http://localhost:5000/products"
        );

        const products =
            await response.json();

        const product =
            products.find(
                p => p.id === id
            );

        document.getElementById(
            "product-name"
        ).value = product.name;

        document.getElementById(
            "product-price"
        ).value = product.price;

        document.getElementById(
            "product-image"
        ).value = product.image;

        editingId = id;

        document.querySelector(
            "#admin-form button"
        ).textContent =
        "Update Product";

    }catch(error){

        console.error(error);
    }
}

// DELETE PRODUCT

async function deleteProduct(id){

    const confirmDelete =
        confirm("Delete this product?");

    if(!confirmDelete){
        return;
    }

    try{

        await fetch(

            `http://localhost:5000/products/${id}`,

            {
                method: "DELETE"
            }

        );

        displayAdminProducts();
        updateDashboard();

    }catch(error){

        console.error(error);

        alert("Failed to delete product");
    }
}


//CLEAR PRODUCTS

function clearProducts(){

    const confirmDelete =
    confirm("Delete all products?");

    if(confirmDelete){

        localStorage.removeItem("adminProducts");

        adminProducts = [];

        displayAdminProducts();

        updateDashboard();
    }
}

//EXPORT PRODUCTS

function exportProducts(){

    console.log(adminProducts);

    alert(
        "Products exported. Check browser console."
    );
}
// RUN DISPLAY

displayAdminProducts();


// CUSTOMER PRODUCTS PAGE

    async function displayCustomerProducts(searchTerm = ""){

        console.log("products are here");

    const productsContainer =
        document.getElementById("products-container");

    if(!productsContainer){
        return;
    }

    try{

        const response = await fetch(
            "http://localhost:5000/products"
        );

        const products =
            await response.json();

console.log(products);

        productsContainer.innerHTML = "";

        const filteredProducts =
            products.filter(product =>

                product.name
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
            );

        filteredProducts.forEach(product => {

            productsContainer.innerHTML += `

            <div class="product-card">

                <img src="${product.image}"
                     alt="${product.name}">

                <h3>${product.name}</h3>

                <p>Ksh ${product.price}</p>

                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
    Add to Cart
</button>

            </div>

            `;
        });

    }catch(error){

        console.error(error);

        productsContainer.innerHTML =
        "<p>Failed to load products.</p>";
    }
}

displayCustomerProducts();

const themeToggle =
document.getElementById("theme-toggle");

// Load saved theme

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "☀️";
}

// Toggle theme

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme","dark");

        themeToggle.textContent = "☀️";

    }else{

        localStorage.setItem("theme","light");

        themeToggle.textContent = "🌙";

    }

});

// UPDATE ADMIN DASHBOARD
async function updateDashboard(){

    try{

        const response = await fetch(
            "http://localhost:5000/products"
        );

        const products =
            await response.json();

        const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

        const totalProducts =
        document.getElementById("total-products");

        const totalOrders =
        document.getElementById("total-orders");

        const totalRevenue =
        document.getElementById("total-revenue");

        const pendingDeliveries =
        document.getElementById("pending-deliveries");

        let revenue = 0;

        orders.forEach(order => {

            revenue += order.total;

        });

        const pendingCount =
        orders.filter(
            order =>
            order.status === "Pending"
        ).length;

        if(totalProducts){

            totalProducts.textContent =
            products.length;
        }

        if(totalOrders){

            totalOrders.textContent =
            orders.length;
        }

        if(totalRevenue){

            totalRevenue.textContent =
            "Ksh " + revenue;
        }

        if(pendingDeliveries){

            pendingDeliveries.textContent =
            pendingCount;
        }

    }catch(error){

        console.error(error);
    }
}

updateDashboard();

const searchProduct =
document.getElementById("search-product");

if(searchProduct){

    searchProduct.addEventListener("input", () => {

        displayAdminProducts(
            searchProduct.value
        );

    });

}


/* Search Event */

const customerSearch = 
document.getElementById(
    "search-customer-product"
);

if(customerSearch){

    customerSearch.addEventListener(
        "input", () => {

            displayCustomerProducts(
                customerSearch.value
            );
        }
    );
}


console.log("About to call products function");
displayCustomerProducts();





// =====================================
// 🧾 VIEW ORDER DETAILS (PROFESSIONAL)
// =====================================
async function viewOrder(orderId) {

    try {
        const response = await fetch(
            `http://localhost:5000/orders/${orderId}`
        );

        const data = await response.json();

        const order = data.order;
        const items = data.items;

        const container = document.getElementById("order-details");

        // Show panel
        container.classList.remove("hidden");

        container.innerHTML = `
            <h3>Order #${order.id}</h3>

            <p><strong>Customer:</strong> ${order.customer_name}</p>
            <p><strong>Phone:</strong> ${order.customer_phone}</p>
            <p><strong>Total:</strong> Ksh ${order.total_amount}</p>
            <p><strong>Status:</strong> ${order.status}</p>

            <hr>

            <h4>Items</h4>

            ${items.map(item => `
                <div class="order-item">
                    <p>Product ID: ${item.product_id}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: Ksh ${item.price_at_purchase}</p>
                </div>
            `).join("")}

            <div class="status-update">
                <button onclick="updateStatus(${order.id}, 'processing')">Processing</button>
                <button onclick="updateStatus(${order.id}, 'shipped')">Shipped</button>
                <button onclick="updateStatus(${order.id}, 'delivered')">Delivered</button>
            </div>

            <button onclick="closeOrderDetails()">Close</button>
        `;

    } catch (error) {
        console.error(error);
        alert("Failed to load order details");
    }
}

// =====================================
// 📦 LOAD ALL ORDERS (ADMIN DASHBOARD)
// =====================================
async function displayOrders() {

    const container = document.getElementById("orders-container");

    if (!container) return;

    try {
        // Fetch orders from backend
        const response = await fetch("http://localhost:5000/orders");

        const orders = await response.json();

        container.innerHTML = "";

        // Loop through orders and display cards
        orders.forEach(order => {

            container.innerHTML += `
                <div class="order-card">

                    <h3>Order #${order.id}</h3>

                    <p><strong>Customer:</strong> ${order.customer_name}</p>
                    <p><strong>Phone:</strong> ${order.customer_phone}</p>
                    <p><strong>Total:</strong> Ksh ${order.total_amount}</p>
                    <p><strong>Status:</strong> ${order.status}</p>

                    <button onclick="viewOrder(${order.id})">
                        View & Update
                    </button>

                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Failed to load orders</p>";
    }
}

// Load orders when page opens
displayOrders();


// =====================================
// 📊 UPDATE ORDER STATUS
// =====================================
async function updateStatus(orderId, status) {

    try {
        await fetch(
            `http://localhost:5000/orders/${orderId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        alert("Status updated!");

        displayOrders();
        viewOrder(orderId);

    } catch (error) {
        console.error(error);
    }
}

// =====================================
// ❌ CLOSE ORDER DETAILS PANEL
// =====================================
function closeOrderDetails() {

    const container = document.getElementById("order-details");

    container.classList.add("hidden");

    container.innerHTML = "";
}