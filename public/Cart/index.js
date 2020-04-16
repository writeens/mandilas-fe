// GLOBAL VARIABLE
let INITIAL_PRICE = 0;
let INITIAL_QUANTITY = 0;

//GLOBAL DOM 
const subTotal = document.querySelector('#cart-subtotal');
const cartTotal = document.querySelector('#cart-total');

// Handle Product Click
const handleProductClick = (elem) => {
    const id = elem.getAttribute(`data-id`)
    if(ENV === 'development'){
        // Local
        window.location.href = `../Airconditioners/index.html?id=${id}`;
    }else{
        // Github
        window.location.href = `../Airconditioners/index.html?id=${id}`;
    }
}

//Function to return a number of random items from an array
const pickRandomItems = (itemArr, numOfItemsToPick) => {
    let randomArray = []
    while(randomArray.length < numOfItemsToPick){
        let randomNumber = Math.floor(Math.random()*itemArr.length)
        if(randomArray.includes(randomNumber) === false){
            randomArray.push(randomNumber)
        }
    }
    let finalArray = randomArray.map(item => itemArr[item]);
    return finalArray;
}

// Fetch Data from Realtime Database
const getData = async (url) => {
    let options = {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }
    let response = await fetch(url, options)
    let data = await response.json()
    return data.data
}

const handleDeleteItemFromCart = async (productID, price, quantityInput) => {
    let token = localStorage.getItem('mandilasToken')
    let response = await fetch(`${deleteCartItemEndpoint}/${productID}`, {
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
    if(response.status !== 200){
        return;
    }
    await response.json();
    const itemToRemove = document.querySelector(`.cart-info-column > [data-id="${productID}"]`);
    itemToRemove.remove();
    let valueToDeduct = price * parseInt(quantityInput.value);
    INITIAL_PRICE -= valueToDeduct;
    subTotal.innerHTML = formatter.format(INITIAL_PRICE);
    // Update Total
    cartTotal.innerHTML = formatter.format(INITIAL_PRICE);
    await updateCartIcon()
}

//Handle Pricing Card
const getPricingTotal = (amount, change) => {
    if(change === '+'){
        INITIAL_PRICE += amount;
        subTotal.innerHTML = formatter.format(INITIAL_PRICE);
    }
    if(change === '-'){
        INITIAL_PRICE -= amount;
        subTotal.innerHTML = formatter.format(INITIAL_PRICE);
    }
    cartTotal.innerHTML = formatter.format(INITIAL_PRICE);
}

//Handle Quantity Change
const handleQuantityChange = async (amount, quantity, change, productID) => {
    let token = localStorage.getItem('mandilasToken')
    if(change === '+'){
        //Update Quantity Input
        let value = parseInt(quantity.value);
        value++;
        const body = {
            'quantity':value
        }
        let response = await fetch(`${updateCartEndpoint}/${productID}`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(body)
        })
        if(response.status !== 200){
            return;
        }
        let result = await response.json();
        quantity.value = value;
        // Update Total
        getPricingTotal(amount, '+');
    }

    // //Update Quantity Input
    if(change === '-' && quantity.value > 1){
        let value = parseInt(quantity.value);
        value--;
        const body = {
            'item':productID,
            'quantity':value
        }
        let response = await fetch(`${updateCartEndpoint}/${productID}`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(body)
        })
        if(response.status !== 200){
            return;
        }
        let result = await response.json();
        quantity.value = value;
        // Update Total
        getPricingTotal(amount, '-');
    }
}
//Populate Cart Item
const cartItemsContainer = document.querySelector('.cart-info-column');
const populateCartItem = (data, itemQuantity) => {
    const {name, description, usage, imageUrl, price, productID} = data;
    const {power, size} = description;
    const itemCard = document.createElement('div');
    itemCard.classList.add('cart-info-details')
    const leftContainer = document.createElement('div');
    const leftImage = document.createElement('img');
    leftImage.src = imageUrl
    const leftSubContainer = document.createElement('div');
    leftSubContainer.classList.add('cart-info-details-1');
    const itemName = document.createElement('p');
    itemName.innerHTML = name;
    const itemPower = document.createElement('p');
    itemPower.innerHTML = `Power: ${power} HP`;
    const itemSize = document.createElement('p');
    itemSize.innerHTML = `Size: ${size}`;
    const priceContainer = document.createElement('div');
    const itemPrice = document.createElement('p');
    itemPrice.innerHTML = formatter.format(price);
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('cart-info-details-2');
    const rightImage = document.createElement('img');
    rightImage.src = 'https://res.cloudinary.com/mandilas/image/upload/v1582705378/Assets/delete_uins7x.svg';
    const rightSubContainer = document.createElement('div');
    const quantity = document.createElement('p');
    quantity.innerHTML = 'Quantity';
    const noOfItemsContainer = document.createElement('div');
    noOfItemsContainer.classList.add('cart-item-size')
    const minus = document.createElement('p');
    minus.innerHTML = '&#45;'
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = itemQuantity;
    quantityInput.disabled = true;
    const plus = document.createElement('p');
    plus.innerHTML = '&#43;'


    //Add Delete Listener to Trash Icon
    rightImage.addEventListener('click', () => handleDeleteItemFromCart(productID, price, quantityInput))

    //Handle Plus Icon
    plus.addEventListener('click', () => handleQuantityChange(price, quantityInput, '+', productID));

    //Handle Minus Icon
    minus.addEventListener('click', () => handleQuantityChange(price, quantityInput, '-', productID));

    itemCard.setAttribute('data-id', productID)
    // Append Items on the right
    noOfItemsContainer.append(minus, quantityInput, plus);
    rightSubContainer.append(quantity, noOfItemsContainer);
    rightContainer.append(rightImage, rightSubContainer);

    // Append Items on the left
    priceContainer.append(itemPrice);
    leftSubContainer.append(itemName, itemPower, itemSize, priceContainer);
    leftContainer.append(leftImage, leftSubContainer);

    itemCard.append(leftContainer, rightContainer);
    cartItemsContainer.append(itemCard);
}

//Create Cart Item
const createCartItem = (arr) => {
    arr.map(async (item) => {
        cartItemsContainer.innerHTML = ""
        let response = await fetch(`${singleProductEndpoint}/${item.item}`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }
        })
        if(response.status !== 200){
            return
        }
        let data = await response.json();
        console.log(data)
        populateCartItem(data, item.quantity)
        removeClass(cartContentLoader, 'showLoader')
        let amount = data.price * item.quantity;
        getPricingTotal(amount, '+')
    })
}

//Show Items In Cart
const cartContentLoader = document.querySelector('.cartContentLoader')
const showItemsInCart = async () => {
    let token = localStorage.getItem('mandilasToken')
    addClass(cartContentLoader, 'showLoader')
    const response = await fetch (getItemsInCartEndpoint, {
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.status !== 200){
        return
    }
    let data = await response.json();
    //No item in cart
    if(data.length <= 0){
        const orderSummary = document.querySelector('.cart-content-right');
        const itemsList = document.querySelector('.cart-info-column');
        const noItemInCart = document.createElement('p');
        noItemInCart.innerHTML = 'There are no items in your cart'
        noItemInCart.setAttribute('id', 'noItemInCart')
        itemsList.innerHTML = ""
        itemsList.append(noItemInCart)
        orderSummary.style.display = 'none';
        loader.classList.remove('showLoader')
        removeClass(cartContentLoader, 'showLoader')
    }
    createCartItem(data)
    console.log(data)
}
// Populate People Also Viewed
const peopleAlsoViewedCart = document.querySelector('.cart-content-bottom-more')
const populatePeopleAlsoViewed = (data) => {
    const {price, imageUrl, name, productID} = data
    const productCard = document.createElement('div');
    productCard.classList.add('cart-content-bottom-item');
    const productImage = document.createElement('img');
    productImage.src = imageUrl;
    const productName = document.createElement('p');
    productName.innerHTML = name;
    const newPrice = formatter.format(price);
    productPrice = document.createElement('p');
    productPrice.classList.add('cart-text-bold-green')
    productPrice.innerHTML = newPrice;

    productCard.setAttribute('data-id', productID)

    productCard.addEventListener('click', () => handleProductClick(productCard))
    // Append
    productCard.append(productImage, productName, productPrice);

    peopleAlsoViewedCart.append(productCard)
}

const getPeopleAlsoViewedItems = async () => {
    peopleAlsoViewedCart.innerHTML = ""
    let options = {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }
    let response = await fetch(productsEndpoint, options)
    if(response.status !== 200){
        return
    }
    let data = await response.json();
    let randomData = pickRandomItems(data, 4)
    randomData.map(item => populatePeopleAlsoViewed(item))
}

// On Page Load
const handleCartPageLoad = async () => {
    loader.classList.add('showLoader')
    const user = await authenticateUser();
    console.log(user)
    if(!user){
        const orderSummary = document.querySelector('.cart-content-right');
        const itemsList = document.querySelector('.cart-info-column');
        const noItemInCart = document.createElement('p');
        noItemInCart.innerHTML = 'There are no items in your cart'
        noItemInCart.setAttribute('id', 'noItemInCart')
        itemsList.innerHTML = ""
        itemsList.append(noItemInCart)
        orderSummary.style.display = 'none';
        loader.classList.remove('showLoader')
        //People Also Viewed
        getPeopleAlsoViewedItems();
        return;
    }
    showItemsInCart();
    getPeopleAlsoViewedItems();
    loader.classList.remove('showLoader')
    
}
window.addEventListener('DOMContentLoaded', handleCartPageLoad)

//Handle Checkout
const cartCheckout = document.querySelector('#cartCheckout');
const handleCartCheckOut = async () => {
    let user = await authenticateUser();
    if(!user){
        infoToast.innerHTML = `Kindly make sure you are logged in`;
        infoToast.classList.add('showInfoToast');
        setTimeout(() => {
            infoToast.classList.remove('showInfoToast')
        }, 2000);
        return;
    }
    window.location.href = '../Checkout/checkout.html'
}
if(cartCheckout){
    cartCheckout.addEventListener('click', handleCartCheckOut)
}