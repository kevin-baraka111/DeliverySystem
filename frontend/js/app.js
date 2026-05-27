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

window.location.href = "products.html";

    });
}