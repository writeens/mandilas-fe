// DOM ELEMENTS

// GLOBAL VARIABLES
let START = 1;
let END = 3;
let QUERY_START = 0;
let QUERY_END = 2;
let PRODUCTS = [];
let SEARCH_PRODUCTS = [];

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
const handleMainAirConPageLoad = async() => {
    // Empty List Before Load
    productList.innerHTML = "";
    addClass(allACLoader, `showLoader`);
    const newURL = `${productsEndpoint}?startAt=${START}&endAt=${END}`
    try{
        let data = await getData(newURL);
        data.map((item, index, arr) => {
            // PRODUCTS.push(item)
            createAC(item)
            removeClass(allACLoader, `showLoader`);
        })
    } catch(e) {
        console.log(e)
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
        mainACLoadMoreButton.style.display = "none";
        console.log(error)
    })
    
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
const queryPrice = document.querySelector('#queryPrice');
const queryType = document.querySelector('#queryType');
const minimumPrice = document.querySelector('#minimumPrice');
const maximumPrice = document.querySelector('#maximumPrice');

if(minimumPrice && maximumPrice){
    minimumPrice.addEventListener('keypress', () => isNumber(event))
    maximumPrice.addEventListener('keypress', () => isNumber(event))
}
const handleSearch = () => {
    addClass(allACLoader, `showLoader`);
    mainACLoadMoreButton.style.display = "none";
    productList.innerHTML = "";
    let acType = queryType.value;
    let acMinimumPrice = minimumPrice.value || 0
    let acMaximumPrice = maximumPrice.value || 9999999
    fetch(productsEndpoint, {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response => response.json())
    .then(result => {
        SEARCH_PRODUCTS = result.data.filter(item => {
            if(item.usage === acType 
                && item.discountedPrice >= acMinimumPrice
                && item.discountedPrice <= acMaximumPrice){
                    return true;
                }
        })
        //Check length of search array
        if(SEARCH_PRODUCTS.length <= 0){
            mainACLoadMoreButtonForQuery.style.display = "none";
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = "There are no products fitting your criteria. Please try searching again."
            productList.append(newParagraph);
            removeClass(allACLoader, `showLoader`);
        }else{
            if(SEARCH_PRODUCTS.length > 3){
                mainACLoadMoreButtonForQuery.style.display = "flex";
            }else{
                mainACLoadMoreButtonForQuery.style.display = "none";
            }
            for(let i = QUERY_START; i<=QUERY_END; i++){
                if(i < SEARCH_PRODUCTS.length){
                    createAC(SEARCH_PRODUCTS[i])
                }
            }
            removeClass(allACLoader, `showLoader`);
        }
    }).catch(error => {
        console.log(error)
        infoText.innerHTML = `Check your network or try refreshing the page.`
        infoToast.classList.add('showInfoToast');
        setTimeout(() => {
            infoToast.classList.remove('showInfoToast')
        }, 3000);
    })
}
queryPrice.addEventListener('click', handleSearch);

//Handle Load More Button for Query
const mainACLoadMoreButtonForQuery = document.querySelector('#mainACLoadMoreButtonForQuery')
if(mainACLoadMoreButtonForQuery){
    mainACLoadMoreButtonForQuery.addEventListener('click', () => {
        mainACLoadMoreButtonForQuery.children[1].style.display = "flex";
        productList.innerHTML = "";
        QUERY_END += 3
        for(let i = QUERY_START; i<=QUERY_END; i++){
            if(i < SEARCH_PRODUCTS.length){
                createAC(SEARCH_PRODUCTS[i])
            }
        }
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