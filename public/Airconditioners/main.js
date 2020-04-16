// DOM ELEMENTS

// GLOBAL VARIABLES
let PRODUCTS = [];
let SEARCH_PRODUCTS = [];
let VISIBLE_PRODUCTS = [];
let ALL_PRODUCTS = [];
let CURSOR = '';
let SEARCH_CURSOR = 0

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
    if(data.status === 'success'){
        return data.data
    }else if(data.status === 'error'){
        return data
    }
}
// Handle Clicking Of Products
const handleProductClick = (elem) => {
    const id = elem.getAttribute(`data-id`)
    if(ENV === 'development'){
        window.location.href = `../Airconditioners/index.html?id=${id}`;
    }else{
        //On Github Pages
        window.location.href = `index.html?id=${id}`;
    }
}
// Create Product
const createAC = (obj) => {
    
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
    price.innerHTML = formatter.format(parseInt(obj.price))

    // Append
    priceContainer.append(price);
    contentCard.append(image);
    contentCard.append(title);
    contentCard.setAttribute('data-id', obj.productID)
    contentCard.append(priceContainer);
    contentCard.addEventListener('click', () => handleProductClick(contentCard) )

    // Add to full list
    productList.append(contentCard)
}
// Handle Page Load
const allACLoader = document.querySelector('.allACLoader');
const handleMainAirConPageLoad = async () => {

    // Empty List Before Load
    productList.innerHTML = "";
    let options = {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }
    try{
        const response = await fetch(`${productsEndpoint}`, options)
        if(response.status !== 200){
            //Error codes here
            return;
        }
        //Get Data
        const data = await response.json();

        
        CURSOR = data[data.length - 1].productID;
        data.map((item, index, arr) => {
            if (index < 6){
                createAC(item)
                ALL_PRODUCTS.push(item);
            }
        })
        //Remove Loader
        removeClass(allACLoader, `showLoader`);
    } catch (error) {
        infoText.innerHTML = `Check your network or try refreshing the page.`
        infoToast.classList.add('showInfoToast');
        setTimeout(() => {
            infoToast.classList.remove('showInfoToast')
        }, 3000);
    }
}
window.addEventListener('load', handleMainAirConPageLoad)

// Handle Load More Button
const mainACLoadMoreButton = document.querySelector('#mainACLoadMoreButton')
const mainACLoadMoreButtonLoader = document.querySelector('#mainACLoadMoreButton > i')
const productImage = document.querySelectorAll('.main-ac-right-content-card > img')
const handleMainACLoadMore = async() => {
    let options = {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }
    try{
        mainACLoadMoreButtonLoader.style.display = "block"
        console.log(CURSOR)
        let response = await fetch(`${productsEndpoint}?last=${CURSOR}`, options);
        if(response.status !== 200){
            return;
        }

        let data = await response.json();
        if(CURSOR === data[data.length - 1].productID){
            return mainACLoadMoreButtonLoader.style.display = "none";
        }
        CURSOR = data[data.length - 1].productID;
        data.map((item, index, arr) => {
            if (index < 6){
                createAC(item)
                ALL_PRODUCTS.push(item);
            }
        })
        mainACLoadMoreButtonLoader.style.display = "none";

    } catch (error) {
        console.log(error)
    }
}
mainACLoadMoreButton.addEventListener('click', handleMainACLoadMore)

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
const searchProducts = document.querySelector('#queryPrice');
const queryType = document.querySelector('#queryType');
const minimumPrice = document.querySelector('#minimumPrice');
const maximumPrice = document.querySelector('#maximumPrice');

if(minimumPrice && maximumPrice){
    minimumPrice.addEventListener('keypress', () => isNumber(event))
    maximumPrice.addEventListener('keypress', () => isNumber(event))
}
const handleSearch = async () => {
    addClass(allACLoader, `showLoader`);
    try{
        mainACLoadMoreButton.style.display = "none";
        productList.innerHTML = "";
        let acType = queryType.value;
        let acMinimumPrice = minimumPrice.value || 0
        let acMaximumPrice = maximumPrice.value || 9999999
        let response = await fetch(`${searchProductsEndpoint}?minprice=${acMinimumPrice}&maxprice=${acMaximumPrice}&usage=${acType}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
        })

        if(response.status !== 200){
            removeClass(allACLoader, `showLoader`);
            return;
        }
        let data = await response.json();

        if(data.length === 0){
            mainACLoadMoreButton.style.display = "none";
            mainACLoadMoreButtonForQuery.style.display = "none";
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = "There are no products fitting your criteria. Please try searching again."
            productList.append(newParagraph);
            removeClass(allACLoader, `showLoader`);
            return;
        }
        SEARCH_PRODUCTS = data
        data.map((item, index, arr) => {
            if (index < 6){
                VISIBLE_PRODUCTS.push(item)
                createAC(item)
            }
        })
        SEARCH_CURSOR = 6;
        if(SEARCH_CURSOR >= SEARCH_PRODUCTS.length){
            mainACLoadMoreButtonForQuery.style.display = "none";
            removeClass(allACLoader, `showLoader`);
            return;
        }
        mainACLoadMoreButtonForQuery.style.display = "flex";
        removeClass(allACLoader, `showLoader`);
    } catch (error){
        console.log(error)
    }
    
}
searchProducts.addEventListener('click', handleSearch);

//Handle Load More Button for Query
const mainACLoadMoreButtonForQuery = document.querySelector('#mainACLoadMoreButtonForQuery')
if(mainACLoadMoreButtonForQuery){
    mainACLoadMoreButtonForQuery.addEventListener('click', () => {
        mainACLoadMoreButtonForQuery.children[1].style.display = "flex";
        productList.innerHTML = "";
        let temp = SEARCH_PRODUCTS.filter((item, index) => {
            if(index >= SEARCH_CURSOR && index < (SEARCH_CURSOR + SEARCH_CURSOR)){
                return item
            }
        })
        SEARCH_CURSOR += SEARCH_CURSOR;
        //Hide Load More once you've displayed all ACs
        if(SEARCH_CURSOR >= SEARCH_PRODUCTS.length){
            mainACLoadMoreButtonForQuery.style.display = "none";
        }
        temp.forEach((item) => VISIBLE_PRODUCTS.push(item));
        VISIBLE_PRODUCTS.forEach((item) => createAC(item));
        mainACLoadMoreButtonForQuery.children[1].style.display = "none";
    })
}

/**Celebration Modal Control */
const closeCelebrationAc = document.querySelector('#closeCelebrationAc');
const celebrationModalAc = document.querySelector('.celebration-modal-ac')
closeCelebrationAc.addEventListener('click', () => {
    celebrationModalAc.style.display = "none";
})
window.addEventListener('load', () => {
    setTimeout(() => {
        let data = sessionStorage.getItem('shownCelebrationAc')
        if(data === null){
            celebrationModalAc.style.display = "flex"
            sessionStorage.setItem('shownCelebrationAc', 'true');
        }
    }, 5000);
})
/**Celebration Modal Control */