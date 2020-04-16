// Document
const singleLoaders = document.querySelectorAll('.singleACLoader');
const commentList = document.querySelector('.ac-content-customer-comment-list')
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
    if(response.status !== 200){
        throw new Error()
    }
    let data = await response.json()
    return data;
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
    return data;
}

//Handle Review Creation
const createReview = async (item) => {
    if(item === null){
        const text = document.createElement('p');
        commentList.style.justifyContent = 'center'
        text.style.alignSelf = 'center'
        text.style.fontSize = '1rem'
        text.innerHTML = 'Be the first to review this product.'
        commentList.append(text);
        const reviewLoader = document.querySelector('.reviewLoader')
        removeClass(reviewLoader, `showLoader`);
    }else {
        const {review, userID, productID, rating} = item
        let data = await getData(`${getAnyUserInfoEndpoint}/${userID}`)
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
    }
}

//Handle Reviews 
const getReviews = async (id) => {
    try{
        let data = await getData(`${getProductReviewEndpoint}/${id}`)
        let dataArray = Object.values(data)
        dataArray.map(item => {createReview(item)})
    } catch (e){
        createReview(null)
    }
}

// Create Single Product Page
const featureContainer = document.querySelector('.ac-features');
const createProductPage = async (id) => {
    try {
        let data = await getSingleProduct(id);
        const { name, usage, imageUrl, price } = data;
        const {power, text, size, feature, featureText} = data.description;
        const title = document.querySelector('.ac-layer-1-content > p:first-child');
        const itemPrice = document.querySelector('.ac-layer-1-content > div:last-of-type > span')
        const description = document.querySelector('.ac-content-left-layer-2 > p:last-of-type')
        const image = document.querySelector('.ac-layer-1-image > img')
        title.innerHTML = name;
        itemPrice.innerHTML = formatter.format(price);
        description.innerHTML = text;
        image.src = imageUrl;

        //Create Feature
        feature.map((item, index) => {
            let featureElement = document.createElement('p');
            featureElement.classList.add('ac-feature-item');
            let featureHeading = document.createElement('span');
            featureHeading.classList.add('ac-features-bold')
            let featureBody = document.createElement('span');
            featureBody.classList.add('ac-features-normal');
            featureHeading.innerText = item;
            featureBody.innerText = featureText[index];
            featureElement.append(featureHeading, featureBody);
            featureContainer.appendChild(featureElement);
        })


        featureContainer.append();
        const mainProductLoaders = document.querySelectorAll('.mainProductLoader')
        mainProductLoaders.forEach(item => removeClass(item, `showLoader`))
    } catch (error) {
        console.log(error)
    }
}

// Create Product
const createAC = (obj) => {
    // let discountNum = Math.round((parseInt(obj.discountedPrice) / parseInt(obj.actualPrice)) * 100)
    
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
    const { price, imageUrl, name, productID } = item
    const itemCard = document.createElement('div');
    itemCard.classList.add('ac-content-bottom-card');
    const itemImage = document.createElement('img');
    itemImage.src = imageUrl;
    const itemName = document.createElement('p');
    itemName.innerHTML = name;
    const itemPrice = document.createElement('p');
    itemPrice.innerHTML = formatter.format(price);

    //Append Items
    // ratingContainer.append(ratingImage, ratingNumber);
    itemCard.append(itemImage, itemName, itemPrice);
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
            let randomData = pickRandomItems(data, 5)
            randomData.map(item => populatePeopleAlsoViewed(item))
            removeClass(peopleAlsoViewedLoader, 'showLoader')
        })
}

//Populate Recommended Items
const recommendedItemsContainer = document.querySelector('.ac-content-right-product-row')
const populateRecommendedItems = (item) => {
    const {price, name, imageUrl, productID} = item;
    const productCard = document.createElement('div')
    productCard.classList.add('ac-content-right-product');
    const productImage = document.createElement('img');
    productImage.src = imageUrl;
    let productName = document.createElement('p');
    productName.innerHTML = name;
    productName.classList.add('rec-name')
    let productPrice = document.createElement('p');
    productPrice.innerHTML = formatter.format(price);
    productPrice.classList.add('rec-price');

    productCard.setAttribute('data-id', productID)

    productCard.addEventListener('click', () => handleProductClick(productCard))
    // Append
    productCard.append(productImage, productName, productPrice);
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
        }).catch(e => {
            console.log("Recommendations are currently unavailable")
        })
}

// Handle On Page Load

const handleSingleAirConPageLoad = async() => {
    try{
        loader.classList.add('showLoader')
        //Add Loader before data arrives
        singleLoaders.forEach(item => addClass(item, 'showLoader'))
        let params = new URLSearchParams(window.location.search.substring(1))
        let id = params.get('id');
        let user = await authenticateUser();
        await createProductPage(id);
        await getReviews(id);
        loader.classList.remove('showLoader')
        getPeopleAlsoViewedItems()
        getRecommendedItems()
        
    } catch (error){
        console.log(error)

    }
}
window.addEventListener('load', handleSingleAirConPageLoad)

const addToCartWithSignIn = async (productID) => {
    const token = localStorage.getItem('mandilasToken')
    try{
        const body = {
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
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(body)
        }

        let response = await fetch(addToCartEndpoint, options)
        //Item already added to cart
        if(response.status === 404){
            infoText.innerHTML = `Item has already been added to cart.`;
            infoToast.classList.add('showInfoToast');
            setTimeout(() => {
                infoToast.classList.remove('showInfoToast')
            }, 2000);
            return;
        }

        if(response.status !== 200){
            return;
        }
        
        infoText.innerHTML = `Item added to cart successfully`;
        await updateCartIcon();
        infoToast.classList.add('showInfoToast');
        setTimeout(() => {
            infoToast.classList.remove('showInfoToast')
        }, 2000);


    } catch (error){
        console.log(error)
        infoText.innerHTML = `Check your network and try again`;
        infoToast.classList.add('showInfoToast');
        setTimeout(() => {
            infoToast.classList.remove('showInfoToast')
        }, 2000);
    }
    
    
        // .then(response => {
        //     return response.json()
        // })
        // .then(data => {
        //     const {status, code} = data
        //     //Successfully added to cart
        //     if(status === 'success'){
        //         updateCartIcon(USER_ID)
        //         infoText.innerHTML = `Item added to cart successfully`;
        //         infoToast.classList.add('showInfoToast');
        //         setTimeout(() => {
        //             infoToast.classList.remove('showInfoToast')
        //         }, 2000);
        //     }
        //     // If item exists
        //     if(status === 'error' && code === 'ITEM_ALREADY_EXISTS'){
        //         infoText.innerHTML = `Item has already been added to cart.`;
        //         infoToast.classList.add('showInfoToast');
        //             setTimeout(() => {
        //                 infoToast.classList.remove('showInfoToast')
        //             }, 2000);
        //     }
        // }).catch(error => {
        //     infoText.innerHTML = `Check your network and try again`;
        //     infoToast.classList.add('showInfoToast');
        //             setTimeout(() => {
        //                 infoToast.classList.remove('showInfoToast')
        //             }, 2000);
        // })
}

// Add to Cart Feature on the single product page
const singleProductAddToCart = document.querySelector('#singleProductAddToCart');
const handleAddToCart = async () => {
    let user = await authenticateUser();
    if(!user){
        return loginModal.style.display = "flex"
    }
    let params = new URLSearchParams(window.location.search.substring(1))
    let id = params.get('id');
    addToCartWithSignIn(id)
}
singleProductAddToCart.addEventListener('click', handleAddToCart)

// Contact Us Feature on the single product page
const singleProductContactUs = document.querySelector('#singleProductContactUs');
singleProductContactUs.addEventListener('click', () => {
    window.location.href = '../Contact Us/index.html'
})





