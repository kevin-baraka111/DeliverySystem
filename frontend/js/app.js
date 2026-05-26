// CART ARRAY

let cart = [];

// ADD TO CART FUNCTION

function addToCart(productName, productPrice){

    // CREATE PRODUCT OBJECT

    const product = {
        name: productName,
        price: productPrice
    };

    // PUSH PRODUCT INTO CART ARRAY

    cart.push(product);

    // SHOW MESSAGE

    alert(productName + " added to cart!");

    // CHECK CART IN CONSOLE

    console.log(cart);
}