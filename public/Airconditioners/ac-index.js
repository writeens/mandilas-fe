//GLOBAL VARIABLES
let ALL_PRODUCTS = [];
let SUBSET_PRODUCTS = []
let START = 0;
let PER_PAGE = 4;
let PAGE = 0;
let NEWPAGE = 0;
let START_INDEX_OF_CURRENT_PAGE = -1;
let START_INDEX_OF_NEXT_PAGE = -1;
let PRODUCTS_FOR_PAGINATION = [];
let INITIAL_PRODUCT_VIEW = []

//Handle On Load Event
const singleAcPageTitle = document.querySelector('#singleAcPageTitle')
const singleAcLoader = document.querySelector('.singleAcLoader');
const singleAcPagination = document.querySelector('.single-ac-pagination');
const singleAcResultContainer = document.querySelector('.single-ac-result-container')

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
            const {imageUrl, actualPrice, name, discountedPrice, productID} = item
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('single-ac-result-container-item');
            itemContainer.setAttribute('data-id', productID)
            const itemImage = document.createElement('img');
            itemImage.src = imageUrl;
            const itemTitle = document.createElement('p');
            itemTitle.innerHTML = name;
            itemTitle.classList.add('single-ac-result-title')
            const itemPrice = document.createElement('p');
            itemPrice.innerHTML = formatter.format(discountedPrice);
            itemPrice.classList.add('single-ac-result-price')
            const itemDiscount = document.createElement('p');
            let discount = `${Math.round((discountedPrice / actualPrice) * 100)}%`;
            itemDiscount.innerHTML = discount;
            itemDiscount.classList.add('single-ac-result-discount')

            itemContainer.addEventListener('click', () => handleProductClick(itemContainer))
            
            itemContainer.append(itemImage, itemTitle, itemPrice, itemDiscount)
            singleAcResultContainer.append(itemContainer);
        })
    }else{
        const p = document.createElement('p');
        p.innerHTML = "No results found"
        p.classList.add('no-results-found')
        singleAcResultContainer.append(p);
    }
}

const goToNextSingleAcPage = (page, data) => {
    //Get the number of pages created
    let pages = singleAcPagination.childNodes;

    //Find the current page
    pages.forEach((item) => {
        if(item.classList.contains('pagination-active')){
            PAGE = parseInt(item.innerHTML);
        }
    })
    START_INDEX_OF_CURRENT_PAGE = (PAGE * PER_PAGE) - PER_PAGE

    //Get the new page to visit
    NEWPAGE = parseInt(page.innerHTML);
    START_INDEX_OF_NEXT_PAGE = (NEWPAGE * PER_PAGE) - PER_PAGE;

    //Pagination
    let newData = data.filter((item, index) => {
        if(index >= START_INDEX_OF_NEXT_PAGE && index < (START_INDEX_OF_NEXT_PAGE + PER_PAGE)){
            return true;
        }
    })
    createACElement(newData)

    //Handle Pagination Color
    pages.forEach((item, index, arr) => {
        item.classList.remove("pagination-active");
    })
    page.classList.add("pagination-active");
}

const handlePagination = (data) => {
    singleAcPagination.innerHTML = "";
    let num = data.length;
    pages = (num > PER_PAGE ) ? Math.ceil(num/PER_PAGE) : 1;
    for(let i = 1; i <=pages; i++){
        let para = document.createElement('p');
        if(i === 1){
            para.classList.add('pagination-active')
        }
        para.innerHTML = i
        singleAcPagination.append(para);
        para.addEventListener('click', () => goToNextSingleAcPage(para, PRODUCTS_FOR_PAGINATION))
    }
    singleAcPagination.style.display = "flex"
}

const handleSingleACSearchLoad = () => {
    getProductData.then(result => {
        if(result.status === 'success'){
            PAGE = 1;
            ALL_PRODUCTS = [...result.data]
            let params = new URLSearchParams(window.location.search.substring(1));
            let id = params.get('id');
            if(id === 'commercial'){
                SUBSET_PRODUCTS = ALL_PRODUCTS.filter((item, index) => {
                    if(item.usage === 'Commercial'){
                        return item;
                    }
                })
                INITIAL_PRODUCT_VIEW = SUBSET_PRODUCTS.filter((item, index) => index >= START && index < PER_PAGE)
                singleAcPageTitle.innerHTML = "Commercial Air Conditioners"
                handlePagination(SUBSET_PRODUCTS)
                PRODUCTS_FOR_PAGINATION = SUBSET_PRODUCTS;
            }else if(id === 'residential'){
                singleAcPageTitle.innerHTML = "Residential Air Conditioners"
                SUBSET_PRODUCTS = ALL_PRODUCTS.filter((item, index) => {
                    if(item.usage === 'Residential'){
                        return item;
                    }
                })
                INITIAL_PRODUCT_VIEW = SUBSET_PRODUCTS.filter((item, index) => index >= START && index < PER_PAGE)
                handlePagination(SUBSET_PRODUCTS)
                PRODUCTS_FOR_PAGINATION = SUBSET_PRODUCTS;
            }else {
                singleAcPageTitle.innerHTML = "Air Conditioners"
                SUBSET_PRODUCTS = ALL_PRODUCTS.filter((item, index) => {
                    if(index >= START && index < PER_PAGE){
                        return item;
                    }
                })
                PRODUCTS_FOR_PAGINATION = ALL_PRODUCTS;
                INITIAL_PRODUCT_VIEW = SUBSET_PRODUCTS;
                handlePagination(ALL_PRODUCTS);
            }
            removeClass(singleAcLoader, 'showLoader')
            createACElement(INITIAL_PRODUCT_VIEW)
        }else{
            console.log("Error retrieving data")
            console.log(result.status)
        }
    })
}
window.addEventListener('load', handleSingleACSearchLoad)
const getProductData = new Promise((resolve, reject) => {
    fetch(productsEndpoint, {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response => response.json())
    .then(result => {
        resolve(result)
    }).catch(error => {
        console.log(error)
    })
})
window.addEventListener('DOMDontentLoaded', getProductData)

const singleAcSearch = document.querySelector('#singleAcSearch');
const singleAcMinimumPrice = document.querySelector('#singleAcMinimumPrice');
const singleAcMaximumPrice = document.querySelector('#singleAcMaximumPrice');
const singleAcSelect = document.querySelector('#singleAcSelect');
const allowOnlyNumbers = (e) => {
    let regexTest = new RegExp("[0-9]", "g");
    if(!regexTest.test(e.key)){
        e.preventDefault()
    }
}
singleAcMinimumPrice.addEventListener('keypress', (e) => allowOnlyNumbers(e))
singleAcMaximumPrice.addEventListener('keypress', (e) => allowOnlyNumbers(e))

const handleSingleAcSearch = () => {
    let acType = singleAcSelect.value;
    if(acType === "Commercial"){
        singleAcPageTitle.innerHTML = "Commercial Air Conditioners"
    }else{
        singleAcPageTitle.innerHTML = "Residential Air Conditioners"
    }
    let min = singleAcMinimumPrice.value || 0;
    let max = singleAcMaximumPrice.value || 9999999;
    SUBSET_PRODUCTS = ALL_PRODUCTS.filter(item => {
        if(item.usage === acType && item.discountedPrice >= min && item.discountedPrice <= max){
            return item
        }
    })
    PAGE = 1;
    PRODUCTS_FOR_PAGINATION = SUBSET_PRODUCTS;
    INITIAL_PRODUCT_VIEW = SUBSET_PRODUCTS.filter((item, index) => index >= START && index <PER_PAGE)
    createACElement(INITIAL_PRODUCT_VIEW);
    handlePagination(SUBSET_PRODUCTS);
}
singleAcSearch.addEventListener('click', handleSingleAcSearch)