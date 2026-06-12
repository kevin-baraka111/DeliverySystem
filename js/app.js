// GET CART FROM LOCAL STORAGE

console.log("APP JS LOADED");


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ADD TO CART FUNCTION

function addToCart(productName, productPrice){

    // CHECK IF PRODUCT EXISTS

    const existingProduct = cart.find(
        item => item.name === productName
    );

    // IF EXISTS INCREASE QUANTITY

    if(existingProduct){

        existingProduct.quantity += 1;

    }else{

        // CREATE NEW PRODUCT

        const product = {
            name: productName,
            price: productPrice,
            quantity: 1
        };

        cart.push(product);
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

// PAYMENT SYSTEM

const paymentForm = document.getElementById("payment-form");

if(paymentForm){

    paymentForm.addEventListener("submit", function(event){

        event.preventDefault();

        // GET PAYMENT METHOD

        const paymentMethod =
            document.getElementById("payment-method").value;

        // SUCCESS MESSAGE

        alert(
            "Payment successful using " +
            paymentMethod.toUpperCase()
        );


// ORDER CREATION

const currentCart =
JSON.parse(localStorage.getItem("cart")) || [];

const orders =
JSON.parse(localStorage.getItem("orders")) || [];

const newOrder = {

    id: Date.now(),

    items: currentCart,

    total: currentCart.reduce(

        (sum, item) =>

        sum +
        Number(item.price) *
        Number(item.quantity),

        0
    ),

    status: "Pending"
};

orders.push(newOrder);

localStorage.setItem(
    "orders",
    JSON.stringify(orders)
);

        // CLEAR CART

        localStorage.removeItem("cart");

        // REDIRECT

        window.location.href = "tracking.html";
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

    let editingIndex = null;

// DISPLAY ADMIN PRODUCTS

function displayAdminProducts(searchTerm = ""){

    const adminProductsContainer =
        document.getElementById("admin-products");

    // STOP IF PAGE DOESN'T EXIST

    if(!adminProductsContainer){
        return;
    }

    adminProductsContainer.innerHTML = "";

    // LOOP PRODUCTS

  //filtering products

    const filteredProducts =
adminProducts.filter(product =>

    product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);


    filteredProducts.forEach((product, index) => {

        adminProductsContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="Product">

            <h3>${product.name}</h3>

            <p>Ksh ${product.price}</p>

            <button onclick="editProduct(${index})">
              Edit
            </button>

            <button onclick="deleteProduct(${index})">
                Delete
            </button>

        </div>

        `;
    });
}


// ADD PRODUCT

if(adminForm){

    adminForm.addEventListener("submit", function(event){

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

        // PUSH PRODUCT AND UPDATING PRODUCT WITHOUT DUPLICATING

        if(editingIndex !== null){

    adminProducts[editingIndex] = product;

    editingIndex = null;

}else{

    adminProducts.push(product);
}

        // SAVE

        localStorage.setItem(
            "adminProducts",
            JSON.stringify(adminProducts)
        );

        // REFRESH DISPLAY

        displayAdminProducts();
        updateDashboard();

        // CLEAR FORM

        adminForm.reset();
    });
}


//EDIT PRODUCT

function editProduct(index){

    const product = adminProducts[index];

    document.getElementById("product-name").value =
        product.name;

    document.getElementById("product-price").value =
        product.price;

    document.getElementById("product-image").value =
        product.image;

        //BETTER BUTTON TEXT-- OPTIONAL--
        document.querySelector(
    "#admin-form button"
).textContent = "Update Product";


    editingIndex = index;

    document.querySelector(
    "#admin-form button"
).textContent = "Add Product";

}

// DELETE PRODUCT

function deleteProduct(index){

    adminProducts.splice(index, 1);

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(adminProducts)
    );

    displayAdminProducts();
    updateDashboard();
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

                <button onclick="addToCart('${product.name}', ${product.price})">
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

function updateDashboard(){

    const products =
    JSON.parse(localStorage.getItem("adminProducts")) || [];

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