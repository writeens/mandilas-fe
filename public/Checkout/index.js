//Update User 
const updateBillingEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/user'
// GLOBAL VARIABLES
const billingFirstName = document.querySelector('#billingFirstName');
const billingLastName = document.querySelector('#billingLastName');
const billingPhoneNumber = document.querySelector('#billingPhoneNumber');
const billingEmail = document.querySelector('#billingEmail');
const billingAddressInput = document.querySelector('#billingAddress');
const billingCity = document.querySelector('#billingCity');
const billingState = document.querySelector('#billingState');
const billingSubmit = document.querySelector('#billingSubmit');
const shippingFee = document.querySelector('#shippingFee');
const orderSummaryShipping = document.querySelector('#orderSummaryShipping');
const orderSummaryTotal = document.querySelector('#orderSummaryTotal');
const orderSummarySubTotal = document.querySelector('#orderSummarySubTotal');
const billingContainer = document.querySelector('.billing-shipment');
const deliveryBox = document.querySelector('.door-delivery');
const pickUpBox = document.querySelector('.dd-delivery-item-list.pickup')
const deliveryRadio = document.querySelector('#deliveryRadio');
const pickUpRadio = document.querySelector('#pickUpRadio');
const payNow = document.querySelector('#payNow');
const payNowMobile = document.querySelector('#payNowMobile')
let CART_TOTAL = 0
let SUB_TOTAL = 0
let CART_DETAILS = [];
let CART_QUANTITY = [];
let CART_USER = {};
let SHIPPING_COST = 0
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

//Create Item
billingContainer.innerHTML = ""
const createItem = (info, quantity) => {
    const {status, data} = info;
    const {name, description, discountedPrice} = data
    const itemHolder = document.createElement('div');
    itemHolder.classList.add('billing-shipment-row');
    const itemQuantity = document.createElement('p');
    itemQuantity.innerHTML = `${quantity}x`
    const itemName = document.createElement('p');
    itemName.innerHTML = name
    const itemCapacity = document.createElement('p');
    itemCapacity.innerHTML = `Capacity: ${description.capacity}HP`
    const itemWattage = document.createElement('p');
    itemWattage.innerHTML = `Wattage: ${description.wattage} watts`;


    itemHolder.append(itemQuantity, itemName, itemCapacity, itemWattage)
    billingContainer.append(itemHolder)
}

//Calculate Pricing
const calculateTotalPrice = (itemDetails, itemCart) => {
    itemDetails.map((item, index) => {
        CART_TOTAL += (item.data.discountedPrice * itemCart[index].quantity)
        SUB_TOTAL += (item.data.discountedPrice * itemCart[index].quantity)
    })
    orderSummaryTotal.innerHTML = formatter.format(CART_TOTAL);
    orderSummarySubTotal.innerHTML = formatter.format(SUB_TOTAL);
}

//Retrieve Information on Items in Cart
const getDataOnItems = (data) => new Promise((resolve, reject) => {
    let infoOnProducts = []
    // Get Data on all items 
    let productInfo = data.map(item => new Promise(resolve => {
        return fetch(`${singleProductEndpoint}/${item.item}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(response => response.json())
        .then(result => resolve(result))
    }))

    Promise.all(productInfo)
        .then(responses => {
            resolve(responses)
        })
})

// .door-delivery:hover{
//     max-height: 10px;
// }

//Handle Checkout Page Load
const handleCheckOutPageLoad = () => {
    loader.classList.add('showLoader')
    handleNavbarLoad
        .then(user => {
            if(user){
                CART_USER.user = user
                const userInfo = firebase.database().ref(`users/${user}`)
                userInfo.once('value')
                    .then(snapshot => {
                        const {email, lastName, firstName, phoneNumber, billingAddress} = snapshot.val()
                        const {address, city, state} = billingAddress
                        // Update UI
                        CART_USER.email = email
                        billingFirstName.value = firstName,
                        billingLastName.value = lastName,
                        billingPhoneNumber.value = phoneNumber,
                        billingEmail.value = email,
                        billingAddressInput.innerHTML = address,
                        billingCity.value = city,
                        billingState.value = state
                    })
                    .then(() => {
                        // Get Items in Cart
                        fetch(`${getItemsInCartEndpoint}/${user}`, {
                            method:'GET',
                            headers:{
                                'Content-Type':'application/json'
                            }
                        })
                        .then(response => response.json())
                        .then(result => {
                            const {status, data} = result
                            // If Status
                            if(status === 'success'){
                                let shippingCost = getShipping(data.length)
                                SHIPPING_COST = shippingCost;
                                shippingFee.innerHTML = formatter.format(shippingCost)
                                orderSummaryShipping.innerHTML = formatter.format(shippingCost);
                                CART_TOTAL += shippingCost

                                getDataOnItems(data)
                                    .then(result => {
                                        data.map((item, index) => {
                                            CART_DETAILS.push(item.item)
                                            CART_QUANTITY.push(item.quantity)
                                        })
                                    loader.classList.remove('showLoader')
                                        // Configure Pricing
                                        calculateTotalPrice(result, data)
                                        result.map((item, index) => {
                                            if(item.status === 'success'){
                                                createItem(item, data[index].quantity)
                                            }
                                        })
                                    })
                            }
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } else{
                // console.log("Logged Out")
                window.location.href = "../Homepage/index.html"
            }
        })
        .catch(error => {
            console.log(error)
            // window.location.href = '../Airconditioners/main.html'
        })
}
window.addEventListener('DOMContentLoaded', handleCheckOutPageLoad)

const validateBilling = (elem) => {
    if(elem.id === 'billingFirstName' || elem.id === 'billingLastName'){
        return (isValidText(elem.value) === true) ? true : shakeInput(elem)
    }
    if(elem.id === 'billingPhoneNumber'){
        return (isValidPhoneNumber(elem.value) === true) ? true : shakeInput(elem)
    }
    if(elem.id === 'billingState' || elem.id === 'billingCity' || elem.id === 'billingAddress' ){
        return (inputIsNotEmpty(elem.value) === true) ? true : shakeInput(elem)
    }
}

// Handle Billing Save and Continue Button
const handleBillingSubmitButton = () => {
    validateBilling(billingFirstName)
    validateBilling(billingLastName)
    validateBilling(billingAddress)
    validateBilling(billingCity)
    validateBilling(billingState)
    validateBilling(billingPhoneNumber)
    if(validateBilling(billingFirstName) &&
    validateBilling(billingLastName) &&
    validateBilling(billingAddress) &&
    validateBilling(billingCity) &&
    validateBilling(billingState) &&
    validateBilling(billingPhoneNumber)){
        const body = {
            firstName:billingFirstName.value,
            lastName:billingLastName.value,
            email: billingEmail.value,
            phoneNumber:billingPhoneNumber.value,
            billingAddress:{
                address:billingAddress.value,
                city:billingCity.value,
                state:billingState.value
            },
            user:USER_ID
        }

        fetch(updateBillingEndpoint, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        .then(response => response.json())
        .then(result => {
            const {data, message, code, status} = result
            if(status === 'success'){
                infoText.innerHTML = 'Your billing information has successfully been saved'
                infoToast.classList.add('showInfoToast');
                setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
            }else{
                infoText.innerHTML = 'Your billing information could not be saved'
                infoToast.classList.add('showInfoToast');
                setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
            }
        }).catch(error => {
            console.log(error)
        })
    }
}
billingSubmit.addEventListener('click', handleBillingSubmitButton)

// Handle Door Delivery
const handlePickupArea = (elem) => {
    console.log(elem.checked)
    if(elem.checked === true){
        pickUpBox.classList.add('show-pick-up')
        deliveryBox.classList.add('hide-delivery')
        CART_TOTAL -= SHIPPING_COST
        orderSummaryShipping.innerHTML = "NGN 0"
        orderSummaryTotal.innerHTML = formatter.format(CART_TOTAL)
    }

}
pickUpRadio.addEventListener('click', (e) => handlePickupArea(e.target))

//Handle Pickup Delivery
const handleDeliveryArea = (elem) => {
    if(elem.checked === true){
        pickUpBox.classList.remove('show-pick-up')
        deliveryBox.classList.remove('hide-delivery')
        CART_TOTAL += SHIPPING_COST
        orderSummaryShipping.innerHTML = formatter.format(SHIPPING_COST)
        orderSummaryTotal.innerHTML = formatter.format(CART_TOTAL)
    }
}
deliveryRadio.addEventListener('click', (e) => handleDeliveryArea(e.target))


const createCustomField = () => {
    let details = CART_DETAILS.join(',')
    let quantity = CART_QUANTITY.join(',')
    return {
        "custom_fields":[
            {
                "display_name":"Cart_Items",
                "variable_name":"cart_items",
                "value":details
            },
            {
                "display_name":"Quantity",
                "variable_name":"quantity",
                "value":quantity
            },
            {
                "display_name":"User",
                "variable_name":"user",
                "value":CART_USER
            }
        ]
    }
}

//Handle Pay Now
const handlePayment = () => {
    validateBilling(billingFirstName)
    validateBilling(billingLastName)
    validateBilling(billingAddress)
    validateBilling(billingCity)
    validateBilling(billingState)
    validateBilling(billingPhoneNumber)
    if(validateBilling(billingFirstName) &&
    validateBilling(billingLastName) &&
    validateBilling(billingAddress) &&
    validateBilling(billingCity) &&
    validateBilling(billingState) &&
    validateBilling(billingPhoneNumber)){
        payNow.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        let customField = createCustomField();
        let AMOUNT_IN_KOBO = CART_TOTAL * 100; 
        const body = {
            "email":CART_USER.email,
            "amount":AMOUNT_IN_KOBO,
            "metadata": customField
        }
        fetch(initiatePaymentEndpoint, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const {status, data} = result
            if(status === 'success'){
                window.location.href = data.redirect_url
            }
            if(status === 'error'){
                payNow.innerHTML = 'Pay Now';
                infoText.innerHTML = 'An error occurred. Please try again'
                infoToast.classList.add('showInfoToast');
                setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
            }
        })
    }else{
        infoText.innerHTML = 'Kindly check your billing information'
        infoToast.classList.add('showInfoToast');
        setTimeout(() => {
            infoToast.classList.remove('showInfoToast')
        }, 2000);
    }
}
payNow.addEventListener('click', handlePayment)

payNowMobile.addEventListener('click', handlePayment)