// Document
const productList = document.querySelector('.main-ac-right-content');
// Endpoint Info for all products
const productsEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/products';
// Endpoint Infor for a single product
const singleProductEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/product'
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits : 6,
    minimumFractionDigits : 0
})

//GLOBAL VARIABLES
let COUNT = 0
let START = 1;
let END = 3;
let PRODUCTS = [];
let CURRENT_PRODUCT = '';

// Check Current Page
const checkPage = () => {
    if(ENV === 'development'){
        if(window.location.pathname === 'Airconditioners/main.html'){
            return 'allProductsPage';
        } else if(window.location.pathname === ('Airconditioners/index.html') || window.location.pathname === ('AirConditioners/index.html')){
            return 'singleProductPage';
        }else{
            return 'checkName'
        }
    }else{
        //On Github Pages
        console.log(window.location.pathname)
        if(window.location.pathname === '/mandilas-fe/Airconditioners/main.html'){
            return 'allProductsPage';
        } else if(window.location.pathname === ('/mandilas-fe/Airconditioners/index.html')){
            return 'singleProductPage';
        }else{
            return 'checkName'
        }
    }
}

// Handle Clicking Of Products
const handleProductClick = (elem) => {
    const id = elem.getAttribute(`data-id`)
    if(ENV === 'development'){
        window.location.href = `Airconditioners/index.html?id=${id}`;
    }else{
        //On Github Pages
        window.location.href = `index.html?id=${id}`;
    }
}

//Get Data on single product
const getSingleProduct = async (id) => {
    const singleLoaders = document.querySelectorAll('.singleACLoader');
    // Show Loader
    singleLoaders.forEach(item => addClass(item, 'showLoader'))
    let url = `${singleProductEndpoint}/${id}`;
    let options = {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }
    let response = await fetch(url, options)
    let data = await response.json();
    //Remove Loader once data arrives
    singleLoaders.forEach(item => removeClass(item, 'showLoader'))
    return data.data
}

// Create Single Product Page
const createProductPage = async (id) => {
    let data = await getSingleProduct(id)
    const { name, usage, imageUrl, actualPrice, discountedPrice, deliveryMaximum, deliveryMinimum } = data
    const { capacity, wattage, text, size} = data.description
    const title = document.querySelector('.ac-layer-1-content > p:first-child');
    const price = document.querySelector('.ac-layer-1-content > div:last-of-type > span')
    const discount = `${Math.round((discountedPrice / actualPrice) * 100)}%`;
    const discountContainer = document.querySelector('.ac-layer-1-content > div:last-of-type > p')
    const description = document.querySelector('.ac-content-left-layer-2 > p:last-of-type')
    const image = document.querySelector('.ac-layer-1-image > img')
    title.innerHTML = name;
    price.innerHTML = formatter.format(discountedPrice);
    discountContainer.innerHTML = discount;
    description.innerHTML = text;
    image.src = imageUrl;
}

// Create Product
const createAC = (obj) => {
    let discountNum = Math.round((parseInt(obj.discountedPrice) / parseInt(obj.actualPrice)) * 100)
    
    // Product Container
    let contentCard = document.createElement('div');
    contentCard.classList.add('main-ac-right-content-card');
    // Product Image
    let image = document.createElement('img');
    image.src = obj.imageUrl;
    // Title
    let title = document.createElement('p');
    title.innerHTML = obj.name;
    // Container for Price and Discount
    let priceContainer = document.createElement('div')
    // Price
    let price = document.createElement('p');
    price.innerHTML = formatter.format(parseInt(obj.discountedPrice))
    // Discount
    let discount = document.createElement('p')
    discount.innerHTML = `${discountNum}%`

    // Append
    priceContainer.append(price);
    priceContainer.append(discount);
    contentCard.append(image);
    contentCard.append(title);
    contentCard.setAttribute('data-id', obj.productID)
    contentCard.append(priceContainer);
    contentCard.addEventListener('click', () => handleProductClick(contentCard) )

    // Add to full list
    productList.append(contentCard)
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

// Populate People Also Viewed
const peopleAlsoViewedContainer = document.querySelector('.ac-content-bottom-row');
const populatePeopleAlsoViewed = (item) => {
    const { discountedPrice, imageUrl, name, productID } = item
    const itemCard = document.createElement('div');
    itemCard.classList.add('ac-content-bottom-card');
    const itemImage = document.createElement('img');
    itemImage.src = imageUrl;
    const itemName = document.createElement('p');
    itemName.innerHTML = name;
    const itemPrice = document.createElement('p');
    itemPrice.innerHTML = formatter.format(discountedPrice);
    const ratingContainer = document.createElement('div');
    const ratingImage = document.createElement('img');
    ratingImage.src = '../Assets/star.svg';
    const ratingNumber = document.createElement('p');
    ratingNumber.innerHTML = '4.5'

    //Append Items
    ratingContainer.append(ratingImage, ratingNumber);
    itemCard.append(itemImage, itemName, itemPrice, ratingContainer);
    itemCard.setAttribute('data-id', productID);

    itemCard.addEventListener('click', () => handleProductClick(itemCard))
    peopleAlsoViewedContainer.append(itemCard);
}


//Handle People Also Viewed Items
const getPeopleAlsoViewedItems = () => {
    const peopleAlsoViewedLoader = document.querySelector('.peopleAlsoViewedLoader')
    addClass(peopleAlsoViewedLoader, 'showLoader')
    peopleAlsoViewedContainer.innerHTML = ""
    getData(productsEndpoint)
        .then(data => {
            let randomData = pickRandomItems(data, 3)
            randomData.map(item => populatePeopleAlsoViewed(item))
            removeClass(peopleAlsoViewedLoader, 'showLoader')
        })
}

//Populate Recommended Items
const recommendedItemsContainer = document.querySelector('.ac-content-right-product-row')
const populateRecommendedItems = (item) => {
    const {discountedPrice, actualPrice, name, imageUrl, productID} = item;
    const productCard = document.createElement('div')
    productCard.classList.add('ac-content-right-product');
    const productImage = document.createElement('img');
    productImage.src = imageUrl;
    const productDiscount = document.createElement('p');
    let discount = `${Math.round((discountedPrice / actualPrice) * 100)}%`;
    productDiscount.innerHTML = discount;
    let productName = document.createElement('p');
    productName.innerHTML = name;
    let productPrice = document.createElement('p');
    productPrice.innerHTML = formatter.format(discountedPrice);

    productCard.setAttribute('data-id', productID)

    productCard.addEventListener('click', () => handleProductClick(productCard))
    // Append
    productCard.append(productImage, productDiscount, productName, productPrice);
    recommendedItemsContainer.append(productCard);
}

//Handle Recommended Items
const getRecommendedItems = () => {
    const recommendedItemsLoader = document.querySelector('.recommendedItemsLoader')
    addClass(recommendedItemsLoader, 'showLoader')
    recommendedItemsContainer.innerHTML = ""
    getData(productsEndpoint)
        .then(data => {
            let randomData = pickRandomItems(data, 3)
            randomData.map(item => populateRecommendedItems(item))
            removeClass(recommendedItemsLoader, 'showLoader')
        })
}

// Handle On Page Load
const handleMainAirConPageLoad = async() => {
    console.log("loading")
    console.log(checkPage())
    // Handle Page Load for All Products Page
    if(checkPage() === 'allProductsPage'){
        // Empty List Before Load
        productList.innerHTML = ""
        const allACLoader = document.querySelector('.allACLoader');
        addClass(allACLoader, `showLoader`);
        const newURL = `${productsEndpoint}?startAt=${START}&endAt=${END}`
        let data = await getData(newURL);
        console.log(data)
        data.map((item, index, arr) => {
            // PRODUCTS.push(item)
            createAC(item)
            removeClass(allACLoader, `showLoader`);
        })
    }
    // Handle Page Load for Single Product Page
    if(checkPage() === 'singleProductPage'){
        let params = new URLSearchParams(window.location.search.substring(1))
        let id = params.get('id');
        // No query provided
        if(id === null){
            if(ENV === 'development'){
                window.location.href = 'Airconditioners/main.html'
            }else{
                //Github
                window.location.href = 'main.html'
            }

        }else{
            console.log(id)
            createProductPage(id);
            getPeopleAlsoViewedItems()
            getRecommendedItems()
        }
    }
}
window.addEventListener('DOMContentLoaded', handleMainAirConPageLoad)

// Handle Load More Button
const mainACLoadMoreButton = document.querySelector('#mainACLoadMoreButton')
const mainACLoadMoreButtonLoader = document.querySelector('#mainACLoadMoreButton > i')
const productImage = document.querySelectorAll('.main-ac-right-content-card > img')
const handleMainACLoadMore = async() => {
    // Add Button Loader
    mainACLoadMoreButtonLoader.style.display = "block"
    // Update Global State
    START += 3;
    END += 3;
    // Update UI
    const newURL = `${productsEndpoint}?startAt=${START}&endAt=${END}`
    getData(newURL).then(data => {
        if(data !== undefined){
            data.map(item => {
                //Remove Button Loader
                mainACLoadMoreButtonLoader.style.display = "none"
                createAC(item)
                PRODUCTS.push(item)
            })
        }
    }).catch(error => {
        console.log(error)
    })
    
}

if(checkPage() === "allProductsPage"){
    mainACLoadMoreButton.addEventListener('click', handleMainACLoadMore)
}

// Add to Cart Feature on the single product page
const singleProductAddToCart = document.querySelector('#singleProductAddToCart');
// const cartNumber = document.querySelectorAll('.navbar-cart-container > .no-of-items')
const handleAddToCart = () => {
    let params = new URLSearchParams(window.location.search.substring(1))
    let id = params.get('id');
    if(id !== null){
        let cart = JSON.parse(localStorage.getItem('mandilasCart'));
        // If Item is not in array
        if(cart.includes(id) !== true){
            cart.push(id);
            localStorageCart = JSON.stringify(cart)
            localStorage.setItem('mandilasCart', localStorageCart);
            cartNumber.forEach(item => {
                item.innerHTML = cart.length
            })
            // Notify User
            toast.children[0].innerHTML = `Item added to cart successfully`;
            toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 2000);
        } else{
            toast.children[0].innerHTML = `Item has already been added to cart.`;
            toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 2000);
        }
    }
}
if(singleProductAddToCart){
    singleProductAddToCart.addEventListener('click', handleAddToCart) 
}