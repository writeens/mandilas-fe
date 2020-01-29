// Single Product Endpoint
const singleProductEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/product';
// Endpoint Info for all products
const productsEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/products';
//Formatter
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits : 6,
    minimumFractionDigits : 0
})

// GLOBAL VARIABLE
let INITIAL_PRICE = 0;
let INITIAL_QUANTITY = 0;

//GLOBAL DOM 
const subTotal = document.querySelector('#cart-subtotal');
const cartTotal = document.querySelector('#cart-total');
const cartShipping = document.querySelector('#cart-shipping');

// Handle Product Click
const handleProductClick = (elem) => {
    const id = elem.getAttribute(`data-id`)
    if(ENV === 'development'){
        // Local
        window.location.href = `Airconditioners/index.html?id=${id}`;
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

const handleDeleteItemFromCart = (id, price, quantityInput) => {
    let cart = JSON.parse(localStorage.getItem('mandilasCart'));
    // Check Cart and make sure item exists
    itemIsInCart = cart.includes(id);
    if(itemIsInCart){
        let itemIndex = cart.indexOf(id);
        cart = cart.filter((item, index) => {
            if(index !== itemIndex){
                return item;
            }
        })
        const itemToRemove = document.querySelector(`.cart-info-column > [data-id="${id}"]`);
        // Remove Node From View
        itemToRemove.remove();
        // Update Cart Info
        localStorage.setItem('mandilasCart', JSON.stringify(cart));
        // Update UI
        cartNumber.forEach(item => {
            item.innerHTML = cart.length;
        })
        // Update Price
        let currentValue = parseInt(quantityInput.value);
        valueToDeduct = currentValue * price
        INITIAL_PRICE -= valueToDeduct;
        subTotal.innerHTML = formatter.format(INITIAL_PRICE);
        //Update Quantity
        INITIAL_QUANTITY -= currentValue;
        let shippingCost = getShipping(INITIAL_QUANTITY);
        cartShipping.innerHTML = formatter.format(shippingCost);
        // Update Total
        cartTotal.innerHTML = formatter.format(INITIAL_PRICE + shippingCost);
    }
}

// Handle Shipping Cost
const getShipping = (quantity) => {
    switch (quantity) {
        case 1:
            return 3000
        case 2:
            return 3500
        case 3:
            return 4000
        case 4:
            return 4500
        default:
            return 0
    }
}

//Handle Pricing Card
const getPricingTotal = (amount, change) => {
    if(change === '+'){
        INITIAL_PRICE += amount;
        subTotal.innerHTML = formatter.format(INITIAL_PRICE);
        INITIAL_QUANTITY++
    }
    if(change === '-'){
        INITIAL_PRICE -= amount;
        subTotal.innerHTML = formatter.format(INITIAL_PRICE);
        INITIAL_QUANTITY--
    }
    let shippingCost = getShipping(INITIAL_QUANTITY);
    cartShipping.innerHTML = formatter.format(shippingCost);
    cartTotal.innerHTML = formatter.format(INITIAL_PRICE + shippingCost);
}

//Handle Quantity Change
const handleQuantityChange = (amount, quantity, change) => {
    if(change === '+'){
        //Update Quantity Input
        let value = parseInt(quantity.value);
        value++;
        quantity.value = value;
        
        // Update Total
        getPricingTotal(amount, '+');

    }

    //Update Quantity Input
    if(change === '-' && quantity.value > 1){
        let value = parseInt(quantity.value);
        value--;
        quantity.value = value;

        // Update Total
        getPricingTotal(amount, '-');
    }
}

//Populate Cart Item
const cartItemsContainer = document.querySelector('.cart-info-column');
const populateCartItem = (data) => {
    const {name, description, usage, imageUrl, actualPrice, discountedPrice, deliveryMaximum, deliveryMinimum, productID} = data;
    const {capacity, wattage, text, size} = data.description;
    const itemCard = document.createElement('div');
    itemCard.classList.add('cart-info-details')
    const leftContainer = document.createElement('div');
    const leftImage = document.createElement('img');
    leftImage.src = imageUrl
    const leftSubContainer = document.createElement('div');
    leftSubContainer.classList.add('cart-info-details-1');
    const itemName = document.createElement('p');
    itemName.innerHTML = name;
    const itemCapacity = document.createElement('p');
    itemCapacity.innerHTML = `Capacity: ${capacity} HP`;
    const itemWattage = document.createElement('p');
    itemWattage.innerHTML = `Wattage: ${wattage}`;
    const priceContainer = document.createElement('div');
    const itemPrice = document.createElement('p');
    itemPrice.innerHTML = formatter.format(discountedPrice);
    const discount = `${Math.round((discountedPrice / actualPrice) * 100)}%`;
    const itemDiscount = document.createElement('p');
    itemDiscount.innerHTML = `-${discount}`;
    const itemDelivery = document.createElement('p');
    itemDelivery.innerHTML = `Estimated Delivery Time: ${deliveryMinimum} - ${deliveryMaximum} Days`;
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('cart-info-details-2');
    const rightImage = document.createElement('img');
    rightImage.src = '../Assets/delete.svg';
    const rightSubContainer = document.createElement('div');
    const quantity = document.createElement('p');
    quantity.innerHTML = 'Quantity';
    const noOfItemsContainer = document.createElement('div');
    noOfItemsContainer.classList.add('cart-item-size')
    const minus = document.createElement('p');
    minus.innerHTML = '&#45;'
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = 1;
    quantityInput.disabled = true;
    const plus = document.createElement('p');
    plus.innerHTML = '&#43;'


    //Add Delete Listener to Trash Icon
    rightImage.addEventListener('click', () => handleDeleteItemFromCart(productID, discountedPrice, quantityInput))

    //Handle Plus Icon
    plus.addEventListener('click', () => handleQuantityChange(discountedPrice, quantityInput, '+'));

    //Handle Minus Icon
    minus.addEventListener('click', () => handleQuantityChange(discountedPrice, quantityInput, '-'));

    itemCard.setAttribute('data-id', productID)
    // Append Items on the right
    noOfItemsContainer.append(minus, quantityInput, plus);
    rightSubContainer.append(quantity, noOfItemsContainer);
    rightContainer.append(rightImage, rightSubContainer);

    // Append Items on the left
    priceContainer.append(itemPrice, itemDiscount);
    leftSubContainer.append(itemName, itemCapacity, itemWattage, priceContainer, itemDelivery);
    leftContainer.append(leftImage, leftSubContainer);

    itemCard.append(leftContainer, rightContainer);
    cartItemsContainer.append(itemCard);
}

//Create Cart Item
const createCartItem = (arr) => {
    arr.map(item => {
        // createCartItem(item)
        addClass(cartContentLoader, 'showLoader')
        cartItemsContainer.innerHTML = ""
        getData(`${singleProductEndpoint}/${item}`)
        .then(data => {
            populateCartItem(data)
            removeClass(cartContentLoader, 'showLoader')
            getPricingTotal(data.discountedPrice, '+')
        })
    })
}

//Show Items In Cart
const cartContentLoader = document.querySelector('.cartContentLoader')
const showItemsInCart = () => {
    let cart = JSON.parse(localStorage.getItem('mandilasCart'));
    //If Cart is Empty
    if(cart.length <= 0){
        if(ENV === 'development'){
            // Local
            window.location.href = `Airconditioners/main.html`
        }else{
            // On Github
            window.location.href = `../Airconditioners/main.html`
        }
    } else if(cart.length > 0){
        // Cart is not empty
        createCartItem(cart)
    }
}

// Populate People Also Viewed
const peopleAlsoViewedCart = document.querySelector('.cart-content-bottom-more')
const populatePeopleAlsoViewed = (data) => {
    const {discountedPrice, imageUrl, name, productID} = data
    const productCard = document.createElement('div');
    productCard.classList.add('cart-content-bottom-item');
    const productImage = document.createElement('img');
    productImage.src = imageUrl;
    const productName = document.createElement('p');
    productName.innerHTML = name;
    const price = formatter.format(discountedPrice);
    productPrice = document.createElement('p');
    productPrice.innerHTML = price;
    const productRatingContainer = document.createElement('div');
    const ratingImage = document.createElement('img');
    ratingImage.src = '../Assets/star.svg';
    const ratingText = document.createElement('p');
    ratingText.innerHTML = '4.5'

    productCard.setAttribute('data-id', productID)

    productCard.addEventListener('click', () => handleProductClick(productCard))
    // Append
    productRatingContainer.append(ratingImage, ratingText);
    productCard.append(productImage, productName, productPrice, productRatingContainer);

    peopleAlsoViewedCart.append(productCard)
}

const getPeopleAlsoViewedItems = () => {
    peopleAlsoViewedCart.innerHTML = ""
    getData(productsEndpoint)
        .then(data => {
            let randomData = pickRandomItems(data, 4)
            randomData.map(item => populatePeopleAlsoViewed(item))
        })
}

// On Page Load
const handleCartPageLoad = () => {
    showItemsInCart();

    //People Also Viewed
    getPeopleAlsoViewedItems();
}
window.addEventListener('DOMContentLoaded', handleCartPageLoad)