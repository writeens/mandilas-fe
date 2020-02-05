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
let CART_TOTAL = 0
let SUB_TOTAL = 0
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

//Handle Checkout Page Load
const handleCheckOutPageLoad = () => {
    handleNavbarLoad
        .then(user => {
            console.log(user)
            if(user){
                const userInfo = firebase.database().ref(`users/${user}`)
                userInfo.once('value')
                    .then(snapshot => {
                        const {email, lastName, firstName, phoneNumber, billingAddress} = snapshot.val()
                        const {address, city, state} = billingAddress
                        // Update UI
                        billingFirstName.value = firstName,
                        billingLastName.value = lastName,
                        billingPhoneNumber.value = phoneNumber,
                        billingEmail.value = email,
                        billingAddressInput.innerHTML = address,
                        billingCity.value = city,
                        billingState.value = state
                    }).catch(error => {
                        console.log(error)
                    })
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
                            shippingFee.innerHTML = formatter.format(shippingCost)
                            orderSummaryShipping.innerHTML = formatter.format(shippingCost);
                            CART_TOTAL += shippingCost

                            getDataOnItems(data)
                                .then(result => {
                                    // Configure Pricing
                                    calculateTotalPrice(result, data)
                                })
                        }
                    })
            } else{
                console.log("Logged Out")
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
                console.log('Update Failed')
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