// GET CART FROM LOCAL STORAGE

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

alert("Order placed successfully!");

// CLEAR CART

localStorage.removeItem("cart");

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

        // CLEAR CART

        localStorage.removeItem("cart");

        // REDIRECT

        window.location.href = "tracking.html";
    });
}

// DELIVERY TRACKING SYSTEM

const deliveryStatus =
    document.getElementById("delivery-status");

if(deliveryStatus){

    // STATUS ARRAY

    const statuses = [
        "Pending",
        "Processing",
        "On The Way",
        "Delivered"
    ];

    let currentStatus = 0;

    // CHANGE STATUS EVERY 3 SECONDS

    setInterval(() => {

        currentStatus++;

        if(currentStatus < statuses.length){

            deliveryStatus.innerHTML =
                statuses[currentStatus];
        }

    }, 3000);
}