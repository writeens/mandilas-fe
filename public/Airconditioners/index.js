// Document
const singleLoaders = document.querySelectorAll('.singleACLoader');
//GLOBAL VARIABLES

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

//Get Data on single product
const getSingleProduct = async (id) => {
    
    // Show Loader
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
    // singleLoaders.forEach(item => removeClass(item, 'showLoader'))
    return data.data
}

//Handle Review Creation
const createReview = (arr) => {
    const commentList = document.querySelector('.ac-content-customer-comment-list')

    if(arr === null){
        const text = document.createElement('p');
        commentList.style.justifyContent = 'center'
        text.style.alignSelf = 'center'
        text.style.fontSize = '1rem'
        text.innerHTML = 'Be the first to review this product.'
        commentList.append(text);
        const reviewLoader = document.querySelector('.reviewLoader')
        removeClass(reviewLoader, `showLoader`);
    }else {
        const {review, userID, productID, rating} = arr
        getData(`${getUserInfoEndpoint}?id=${userID}`)
            .then(data => {
                const reviewContainer = document.createElement('div');
                reviewContainer.classList.add('ac-content-customer-comment');
                const emptyDiv = document.createElement('div');
                const customerName = document.createElement('p');
                customerName.innerHTML = `${data.firstName} ${data.lastName}`
                const reviewText = document.createElement('p')
                reviewText.innerHTML = review
                
                const starContainer = document.createElement('p');
                starContainer.classList.add('ac-layer-1-content-stars')
                for(let i = 0; i<rating; i++){
                    const star = document.createElement('img');
                    star.src = "https://res.cloudinary.com/mandilas/image/upload/v1582705409/Assets/star_uk5thw.svg"
                    starContainer.append(star)
                }
                

                //Append Items
                emptyDiv.append(customerName, starContainer)
                reviewContainer.append(emptyDiv, reviewText)
                commentList.append(reviewContainer)

                const reviewLoader = document.querySelector('.reviewLoader')
                removeClass(reviewLoader, `showLoader`);
            }) 
    }
}

//Handle Reviews 
const getReviews = (id) => {
    getData(`${getProductReviewEndpoint}?id=${id}`)
        .then(data => {
            if(data.status === 'error'){
                createReview(null)
            }else{
                let dataArray = Object.values(data)
                dataArray.map(item => {
                    createReview(item)
                })
            }
        })
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
    const mainProductLoaders = document.querySelectorAll('.mainProductLoader')
    mainProductLoaders.forEach(item => removeClass(item, `showLoader`))
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
    ratingImage.src = 'https://res.cloudinary.com/mandilas/image/upload/v1582705409/Assets/star_uk5thw.svg';
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

const handleSingleAirConPageLoad = async() => {
    // Handle Page Load for Single Product Page
    loader.classList.add('showLoader')
        //Add Loader before data arrives
        singleLoaders.forEach(item => addClass(item, 'showLoader'))
        let params = new URLSearchParams(window.location.search.substring(1))
        let id = params.get('id');
        handleNavbarLoad
            .then((user) => {
                //Add Loader before data arrives
                loader.classList.remove('showLoader')
                
                // No query provided
                if(id === null){
                    if(ENV === 'development'){
                        window.location.href = '../Airconditioners/main.html'
                    }else{
                        //Github
                        window.location.href = 'main.html'
                    }

                }else{
                    createProductPage(id);
                    getPeopleAlsoViewedItems()
                    getRecommendedItems()
                    getReviews(id);
                }
            }).catch(error => {
                console.log(error)
            })
}
window.addEventListener('load', handleSingleAirConPageLoad)

const addToCartWithSignIn = (productID, userID) => {
    const body = {
        uid:userID,
        cart:{
            [productID]:{
                item:productID,
                quantity:1
            }
        }
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    }
    fetch(addToCartEndpoint, options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            const {status, code} = data
            console.log(status)
            //Successfully added to cart
            if(status === 'success'){
                updateCartIcon(USER_ID)
                infoText.innerHTML = `Item added to cart successfully`;
                infoToast.classList.add('showInfoToast');
                setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
            }
            // If item exists
            if(status === 'error' && code === 'ITEM_ALREADY_EXISTS'){
                infoText.innerHTML = `Item has already been added to cart.`;
                infoToast.classList.add('showInfoToast');
                    setTimeout(() => {
                        infoToast.classList.remove('showInfoToast')
                    }, 2000);
            }
        }).catch(error => {
            console.log(error)
            infoText.innerHTML = `Check your network and try again`;
            infoToast.classList.add('showInfoToast');
                    setTimeout(() => {
                        infoToast.classList.remove('showInfoToast')
                    }, 2000);
        })
}

// Add to Cart Feature on the single product page
const singleProductAddToCart = document.querySelector('#singleProductAddToCart');
const handleAddToCart = () => {
    let params = new URLSearchParams(window.location.search.substring(1))
    let id = params.get('id');
    if(isUserLoggedIn === false){
        // Show Modal
        loginModal.style.display = "flex"
    }else{
        addToCartWithSignIn(id, USER_ID)
    }
}
singleProductAddToCart.addEventListener('click', handleAddToCart)

// Contact Us Feature on the single product page
const singleProductContactUs = document.querySelector('#singleProductContactUs');
singleProductContactUs.addEventListener('click', () => {
    window.location.href = '../Contact Us/index.html'
})





