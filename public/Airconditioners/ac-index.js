//GLOBAL VARIABLES
let ALL_PRODUCTS = [];
let SUBSET_PRODUCTS = []
let PER_PAGE = 6;
let CURSOR = 0
let SEARCH_PRODUCTS = [];
let SEARCH_CURSOR = 0;
let VISIBLE_PRODUCTS = []

//Handle On Load Event
const singleAcPageTitle = document.querySelector('#singleAcPageTitle')
const singleAcLoader = document.querySelector('.singleAcLoader');
const singleAcPagination = document.querySelector('.single-ac-pagination');
const singleAcResultContainer = document.querySelector('.single-ac-result-container')
const singleACLoadMoreButton = document.querySelector('#singleACLoadMoreButton');
const singleAcResultContainerItems = document.querySelectorAll('.single-ac-result-container-item');

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

const createACElement = (data) => {
    singleAcResultContainer.innerHTML = ""
    if(data.length > 0){
        data.map((item, index) => {
            const {imageUrl, name, price, productID} = item
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('single-ac-result-container-item');
            itemContainer.setAttribute('data-id', productID)
            const itemImage = document.createElement('img');
            itemImage.src = imageUrl;
            const itemTitle = document.createElement('p');
            itemTitle.innerHTML = name;
            itemTitle.classList.add('single-ac-result-title')
            const itemPrice = document.createElement('p');
            itemPrice.innerHTML = formatter.format(price);
            itemPrice.classList.add('single-ac-result-price')

            itemContainer.addEventListener('click', () => handleProductClick(itemContainer))
            
            itemContainer.append(itemImage, itemTitle, itemPrice)
            singleAcResultContainer.append(itemContainer);
        })
    }else{
        const p = document.createElement('p');
        p.innerHTML = "No results found"
        p.classList.add('no-results-found')
        singleAcResultContainer.append(p);
    }
}

//Handle Load More Button Click
const handleSingleAcLoadMore = () => {
    singleAcLoader.classList.add('showLoader')
    ALL_PRODUCTS.forEach((item, index) => {
        if(index >= PER_PAGE && index < (PER_PAGE + PER_PAGE)){
            SUBSET_PRODUCTS.push(item)
        }
    })
    PER_PAGE = (PER_PAGE + PER_PAGE)
    if(SUBSET_PRODUCTS.length >= ALL_PRODUCTS.length){
        singleACLoadMoreButton.style.display = 'none';
    }
    createACElement(SUBSET_PRODUCTS);
    singleAcLoader.classList.remove('showLoader')
}
singleACLoadMoreButton.addEventListener('click', handleSingleAcLoadMore)

const handleSingleACSearchLoad = async () => {
    try{
        let params = new URLSearchParams(window.location.search.substring(1));
        let id = params.get('id');
        let value = ''
        if(id === 'residential'){
            value = 'Residential'
            singleAcPageTitle.innerHTML = 'Residential Cooling'
        }else if(id === 'commercial'){
            value = 'Commercial'
            singleAcPageTitle.innerHTML = 'Commercial Cooling'
        } else if(id === null){
            window.location.href = './ac.html?id=commercial'
            
        }
        const data = await retrieveData(value)
        ALL_PRODUCTS = [...data];
        SUBSET_PRODUCTS = data.filter((item, index) => {
            if(index < PER_PAGE){
                return item
            }
        })
        if(SUBSET_PRODUCTS.length >= ALL_PRODUCTS.length){
            singleACLoadMoreButton.style.display = 'none';
        }
        CURSOR = PER_PAGE;
        createACElement(SUBSET_PRODUCTS);
        singleAcLoader.classList.remove('showLoader')
    } catch (error){
        console.log(error)
    }
}
const retrieveData = async (usage) => {
    let response = await fetch(`${productsEndpoint}?usage=${usage}`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    })
    let result = await response.json();
    return result;
}
window.addEventListener('load', handleSingleACSearchLoad)


const singleAcSearch = document.querySelector('#singleAcSearch');
const singleAcMinimumPrice = document.querySelector('#singleAcMinimumPrice');
const singleAcMaximumPrice = document.querySelector('#singleAcMaximumPrice');
const singleAcSelect = document.querySelector('#singleAcSelect');
const singleACLoadMoreButtonForQuery = document.querySelector('#singleACLoadMoreButtonForQuery')
const allowOnlyNumbers = (e) => {
    let regexTest = new RegExp("[0-9]", "g");
    if(!regexTest.test(e.key)){
        e.preventDefault()
    }
}
singleAcMinimumPrice.addEventListener('keypress', (e) => allowOnlyNumbers(e))
singleAcMaximumPrice.addEventListener('keypress', (e) => allowOnlyNumbers(e))

const handleSingleAcSearch = async () => {
    singleAcLoader.classList.add('showLoader')
    try{
        singleACLoadMoreButton.style.display = "none";
        singleAcResultContainer.innerHTML = ""
        let min = singleAcMinimumPrice.value || 0;
        let max = singleAcMaximumPrice.value || 9999999;
        let usage = singleAcSelect.value

        let response = await fetch(`${searchProductsEndpoint}?minprice=${min}&maxprice=${max}&usage=${usage}`, {
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
        singleAcPageTitle.innerHTML = `Search Results for ${usage} Cooling`
        
        //Search Returns Zero
        if(data.length === 0){
            const p = document.createElement('p');
            p.innerHTML = "No results found"
            p.classList.add('no-results-found')
            singleAcResultContainer.append(p);
            singleAcLoader.classList.remove('showLoader')
            return;
        }

        SEARCH_PRODUCTS = data
        VISIBLE_PRODUCTS = [];
        data.forEach((item, index, arr) => {
            if (index < 6){
                VISIBLE_PRODUCTS.push(item)
            }
        })
        createACElement(VISIBLE_PRODUCTS)
        SEARCH_CURSOR = 6;
        if(SEARCH_CURSOR >= SEARCH_PRODUCTS.length){
            singleACLoadMoreButtonForQuery.style.display = "none";
            singleAcLoader.classList.remove('showLoader')
            return;
        }
        singleACLoadMoreButtonForQuery.style.display = "flex";
        singleAcLoader.classList.remove('showLoader')
    } catch (error){
        console.log(error)
    }
}
singleAcSearch.addEventListener('click', handleSingleAcSearch)

if(singleACLoadMoreButtonForQuery){
    singleACLoadMoreButtonForQuery.addEventListener('click', () => {
        singleACLoadMoreButtonForQuery.children[1].style.display = "flex";
        singleAcResultContainer.innerHTML = ""
        let temp = SEARCH_PRODUCTS.filter((item, index) => {
            if(index >= SEARCH_CURSOR && index < (SEARCH_CURSOR + SEARCH_CURSOR)){
                return item;
            }
        })
        SEARCH_CURSOR += SEARCH_CURSOR;
        //Hide Load More once you've displayed all ACs
        if(SEARCH_CURSOR >= SEARCH_PRODUCTS.length){
            singleACLoadMoreButtonForQuery.style.display = "none";
        }
        temp.forEach((item) => VISIBLE_PRODUCTS.push(item));
        createACElement(VISIBLE_PRODUCTS)
        singleACLoadMoreButtonForQuery.children[1].style.display = "none";
    })
}