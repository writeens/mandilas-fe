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

const handleDeleteItemFromCart = (user, productID, price, quantityInput) => {
    fetch(`${deleteCartItemEndpoint}/${user}/${productID}`, {
        method:'DELETE',
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        const itemToRemove = document.querySelector(`.cart-info-column > [data-id="${productID}"]`);
        itemToRemove.remove();
        let valueToDeduct = price * parseInt(quantityInput.value);
        INITIAL_PRICE -= valueToDeduct;
        subTotal.innerHTML = formatter.format(INITIAL_PRICE);
        // Update Total
        cartTotal.innerHTML = formatter.format(INITIAL_PRICE);
    })
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
const handleQuantityChange = (amount, quantity, change, user, productID) => {
    if(change === '+'){
        //Update Quantity Input
        let value = parseInt(quantity.value);
        value++;
        const body = {
            'item':productID,
            'quantity':value
        }
        fetch(`${updateCartEndpoint}/${user}`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        .then(response => response.json())
        .then(result => {
            quantity.value = value;
            // Update Total
            getPricingTotal(amount, '+');
        })
    }

    // //Update Quantity Input
    if(change === '-' && quantity.value > 1){
        let value = parseInt(quantity.value);
        value--;
        const body = {
            'item':productID,
            'quantity':value
        }
        fetch(`${updateCartEndpoint}/${user}`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        .then(response => response.json())
        .then(result => {
            quantity.value = value;
            // Update Total
            getPricingTotal(amount, '-');
        })
    }
}
//Populate Cart Item
const cartItemsContainer = document.querySelector('.cart-info-column');
const populateCartItem = (data, itemQuantity, user) => {
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
    // const discount = `${Math.round((discountedPrice / actualPrice) * 100)}%`;
    // const itemDiscount = document.createElement('p');
    // itemDiscount.innerHTML = `-${discount}`;
    // const itemDelivery = document.createElement('p');
    // itemDelivery.innerHTML = `Estimated Delivery Time: ${deliveryMinimum} - ${deliveryMaximum} Days`;
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
    rightImage.addEventListener('click', () => handleDeleteItemFromCart(user, productID, price, quantityInput))

    //Handle Plus Icon
    plus.addEventListener('click', () => handleQuantityChange(price, quantityInput, '+', user, productID));

    //Handle Minus Icon
    minus.addEventListener('click', () => handleQuantityChange(price, quantityInput, '-', user, productID));

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
const createCartItem = (arr, user) => {
    arr.map(item => {
        cartItemsContainer.innerHTML = ""
        getData(`${singleProductEndpoint}/${item.item}`)
        .then(data => {
            populateCartItem(data, item.quantity, user)
            removeClass(cartContentLoader, 'showLoader')
            let amount = data.price * item.quantity;
            getPricingTotal(amount, '+')
        })
    })
}

//Show Items In Cart
const cartContentLoader = document.querySelector('.cartContentLoader')
const showItemsInCart = (id) => {
    addClass(cartContentLoader, 'showLoader')
    fetch(`${getItemsInCartEndpoint}/${id}`, {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    })
        .then(response => response.json())
        .then(result => {
            const {status, data} = result
            console.log(status)
            if(status === 'success'){
                createCartItem(data, id)
                loader.classList.remove('showLoader')
            }else if(status === 'error'){
                //Handle No Item In Cart
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
        }).catch(error => {
            //Handle Error Here
            console.log(error)
            const orderSummary = document.querySelector('.cart-content-right');
            const itemsList = document.querySelector('.cart-info-column');
            const noItemInCart = document.createElement('p');
            noItemInCart.innerHTML = 'There are no items in your cart'
            noItemInCart.setAttribute('id', 'noItemInCart')
            itemsList.innerHTML = ""
            itemsList.append(noItemInCart)
            orderSummary.style.display = 'none';
            loader.classList.remove('showLoader')
        })
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
    ratingImage.src = 'https://res.cloudinary.com/mandilas/image/upload/v1582705409/Assets/star_uk5thw.svg';
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
    loader.classList.add('showLoader')
    handleNavbarLoad
        .then(user => {
            if(user){
                showItemsInCart(user);
                //People Also Viewed
                getPeopleAlsoViewedItems();
            }else{
                console.log("object")
                //People Also Viewed
                getPeopleAlsoViewedItems()
                loader.classList.remove('showLoader')
            }
        }).catch(error => {
            console.log(error)
            const orderSummary = document.querySelector('.cart-content-right');
            const itemsList = document.querySelector('.cart-info-column');
            const noItemInCart = document.createElement('p');
            noItemInCart.innerHTML = 'There are no items in your cart'
            noItemInCart.setAttribute('id', 'noItemInCart')
            itemsList.innerHTML = ""
            itemsList.append(noItemInCart)
            orderSummary.style.display = 'none';
            loader.classList.remove('showLoader')
        })
}
window.addEventListener('DOMContentLoaded', handleCartPageLoad)

//Handle Checkout
const cartCheckout = document.querySelector('#cartCheckout');
const handleCartCheckOut = () => {
    handleNavbarLoad
        .then(user => {
            // Check for presence of user 
            if(user){
                window.location.href = '../Checkout/checkout.html'
            }
        }).catch(error => {
            infoToast.innerHTML = `Kindly make sure you are logged in`;
            infoToast.classList.add('showInfoToast');
                setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
        })
}
if(cartCheckout){
    cartCheckout.addEventListener('click', handleCartCheckOut)
}