/**DOM ELEMENTS & VARIABLES */
let isUserLoggedIn = false;
let USER_ID = ''
const navbarCart = document.querySelectorAll('.cart-container');
const navbarToggler = document.querySelector('#navbarToggler');
const preAuth = document.querySelector('.pre-auth');
const postAuth = document.querySelector('.post-auth');
const menu = document.querySelector('.menu');
const productList = document.querySelector('.main-ac-right-content');
const navFirstName = document.querySelector('#navbarFirstName')
const navLastName = document.querySelector('#navbarLastName')
const navEmail = document.querySelector('#navbarEmail')
const navPassword = document.querySelector('#navbarPassword')
const navPhoneNumber = document.querySelector('#navbarPhoneNumber')
const navRegister = document.querySelector('#registerFromRegisterModal')
const navLogIn = document.querySelector('#loginFromLoginModal');
const navLogInEmail = document.querySelector('#navLogInEmail')
const navLogInPassword = document.querySelector('#navLogInPassword')
const loginButton = document.querySelector('#login')
const registerButton = document.querySelector('#register')
const loginModal = document.querySelector('#loginModal')
const registerModal = document.querySelector('#registerModal')
const registerFromLoginModal = document.querySelector('#registerFromLoginModal');
const loginFromRegisterModal = document.querySelector('#loginFromRegisterModal');
const closeLogin = document.querySelector('#closeLogin');
const closeRegister = document.querySelector('#closeRegister')
// Log Out Buttons
const navLogOut = document.querySelector('#logout')
//Pre Sign In Buttons
const preSignedInButtonContainer = document.querySelector('.pre-auth')
//Post Sign In Buttons
const postSignedInButtonContainer = document.querySelector('.post-auth')
//Loader
const loader = document.querySelector('#loader')
//Message Toast
const infoToast = document.querySelector('#infoToast');
const infoText = document.querySelector('#infoText');
/**DOM ELEMENTS & VARIABLES */

//Client Side Validation
const navbarMenuItems = document.querySelectorAll('[data-nav-key]');
    const handleNavbarMenuItemClick = (elem, index, arr) => {
        let hasSubmenu = elem.getAttribute('data-nav-key');
        if(hasSubmenu === "true"){
            arr.forEach((item, innerIndex) => {
                if(index !== innerIndex){
                    item.children[2].classList.remove('show-tooltip-desktop');
                }
            })
            elem.children[2].classList.toggle("show-tooltip-desktop");
        }
    }
    navbarMenuItems.forEach((item, index, arr) => {
        item.addEventListener('click', () => handleNavbarMenuItemClick(item, index, arr))
    })

    navbarToggler.addEventListener('click', () => {
        if(navbarToggler.children[0].classList.contains("fa-bars")){
            navbarToggler.children[0].classList.remove('fa-bars')
            navbarToggler.children[0].classList.add('fa-close')
        }else{
            navbarToggler.children[0].classList.remove('fa-close')
            navbarToggler.children[0].classList.add('fa-bars')
        }
        menu.classList.toggle('menu-show');
        if(preAuth){
            preAuth.classList.toggle('auth-show');
        }
        if(postAuth){
            postAuth.classList.toggle('auth-show')
        }
    })

/**Modal Management */

//Show Login Modal upon click
loginButton.addEventListener('click', () => {
    loginModal.style.display = "flex"
})
//Show Regsiter Modal upon click
registerButton.addEventListener('click', () => {
    registerModal.style.display = "flex"
})
//Handle Register button click in Login Modal
registerFromLoginModal.addEventListener('click', () => {
    clearLogin()
    loginModal.style.display = "none";
    registerModal.style.display = "flex"

})
//Handle Login button click in Register Modal
loginFromRegisterModal.addEventListener('click', () => {
    clearRegister()
    registerModal.style.display = "none"
    loginModal.style.display = "flex";
})
//Close Login Modal
closeLogin.addEventListener('click', () => {
    clearLogin()
    loginModal.style.display = 'none'
})
//Close Register Modal
closeRegister.addEventListener('click', () => {
    clearRegister();
    registerModal.style.display = 'none'
})

/**Modal Management */

/**Client Side JS */

// Endpoint Info for all products
const productsEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/products';
// Endpoint Info for a single product
const singleProductEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/product';
// Endpoint to add item to cart
const addToCartEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/cart/add';
// Endpoint to get items in cart
const getItemsInCartEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/cart';
// Endpoint to make payment
const initiatePaymentEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/payment';
// Endpoint Info for all products
const updateCartEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/cart'
const deleteCartItemEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/cart'
const signUpEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/sign-up'
const logInEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/sign-in'
const getProductReviewEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/review'
const getUserInfoEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/user';
const getAnyUserInfoEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/anyuser';
const searchProductsEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/products/search'
//Check Environment
let ENV = ''
const checkEnvironment = () => {
    let origin = window.location.origin;
    if(origin === 'http://127.0.0.1:5500'){
        ENV = `development`
    }else{
        ENV = `production`
    }
    console.log(ENV);
}
checkEnvironment();

//Formatter
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits : 6,
    minimumFractionDigits : 0
})

// Handle Showing Loader
const addClass = (elem, customClass) => {
    elem.parentNode.classList.add('removePadding')
    elem.classList.add(customClass)
}
//Handle Removing Loader
const removeClass = (elem, customClass) => {
    elem.parentNode.classList.remove('removePadding')
    elem.classList.remove(customClass)
}

//Clear Login
const clearLogin = () => {
    navLogInEmail.value = "",
    navLogInPassword.value = ""
}
const clearRegister = () => {
    navFirstName.value = "",
    navLastName.value = "",
    navEmail.value = "",
    navPhoneNumber.value = "",
    navPassword.value = ""
}
const shakeInput = (elem) => {
    elem.classList.add('shake')
    elem.classList.add('invalid-input')
    setTimeout(() => {
        elem.classList.remove('shake')
        elem.classList.remove('invalid-input')
    }, 500);
}

const inputIsNotEmpty = (str) => {
    return (str !== "" && str !== null) ? true : false
}

const isValidText = (str) => {
    let trimStr = str.trim();
    const textRegex = RegExp("^[a-z|A-Z]*$");
    return (textRegex.test(trimStr) && trimStr !== "") ? true : false
}
const isValidEmail = (str) => {
    let trimStr = str.trim();
    const emailRegex = RegExp("^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)$")
    return (emailRegex.test(trimStr) && trimStr !== "") ? true : false
}
const isValidPhoneNumber = (str) => {
    let trimStr = str.trim();
    const phoneRegex = /^(0|\+234)\d{10}$/
    return (phoneRegex.test(trimStr) && trimStr !== "") ? true : false
}

//Update Cart Number
const updateCartIcon = async () => {
    const cartNumber = document.querySelectorAll('.cart-container > .no-of-items')
    let token = localStorage.getItem('mandilasToken')

    try{
        if(token === null){
            return cartNumber.forEach(item => item.innerHTML = 0)
        }
        let response = await fetch(`${getItemsInCartEndpoint}`, {
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status !== 200){
            return cartNumber.forEach(item => item.innerHTML = 0)
        }
        let data = await response.json();
        cartNumber.forEach(item => item.innerHTML = data.length)
        
    } catch (error){
        cartNumber.forEach(item => item.innerHTML = 0)
    }
}

//Validate Input from Sign Up Form
const validateData = (elem) => {
    if(elem.id === 'navbarFirstName' || elem.id === 'navbarLastName'){
        return (isValidText(elem.value) === true) ? true : shakeInput(elem)
    }
    if(elem.id === 'navbarEmail' || elem.id === 'navLogInEmail'){
        return (isValidEmail(elem.value) === true) ? true : shakeInput(elem)
    }
    if(elem.id === 'navbarPassword' || elem.id === 'navLogInPassword'){
        return (elem.value !== "" && elem.value.length > 6) ? true : shakeInput(elem)
    }
    if(elem.id === 'navbarPhoneNumber'){
        return (isValidPhoneNumber(elem.value) === true) ? true : shakeInput(elem)
    }
}

// Handle the Register Modal
const handleRegister = async () => {
    validateData(navFirstName)
    validateData(navLastName)
    validateData(navEmail)
    validateData(navPassword)
    validateData(navPhoneNumber)
    if(validateData(navFirstName) &&
    validateData(navLastName) &&
    validateData(navEmail) &&
    validateData(navPassword) &&
    validateData(navPhoneNumber)){
        // Add Loader
        loader.classList.add('showLoader')
        //Create Request Body
        const body = {
            "firstName":navFirstName.value,
            "lastName":navLastName.value,
            "email":navEmail.value,
            "password":navPassword.value,
            "phoneNumber":navPhoneNumber.value
        }

        // Fetch options for posting JSON
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        //Post Data to Custom Mandilas Endpoint using browser-based FETCH
        try{
            let response = await fetch(signUpEndpoint, options)
            let data = await response.json();
            
            //Invalid Phone Number
            if(data.code === 'auth/phone-number-already-exists'){
                infoText.innerHTML = "Phone number belongs to another user"
                infoToast.classList.add('showInfoToast');
                loader.classList.remove('showLoader')   
                return setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
            }
            if(data.code === 'auth/email-already-exists'){
                infoText.innerHTML = "Email already in use, try logging in"
                infoToast.classList.add('showInfoToast'); 
                loader.classList.remove('showLoader')  
                return setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
            }
            const {uid, email, firstName, lastName, token} = data
            //Store variables on client side
            localStorage.setItem('mandilasToken', `${token}`)
            postSignedInButtonContainer.children[0].innerHTML = `Hello, ${body["firstName"]}`;
            // Remove Modal
            registerModal.style.display = "none"
            loginModal.style.display = "none"
            // Show Post Register View
            postSignedInButtonContainer.style.display = 'flex';
            preSignedInButtonContainer.style.display = 'none';
            //Clear Defaults
            clearRegister();
            isUserLoggedIn = true;
            // Set User ID
            USER_ID = uid

            loader.classList.remove('showLoader')
            await updateCartIcon();
            infoText.innerHTML = `Hi ${firstName}, You have successfully registered`
            infoToast.classList.add('showInfoToast');
            setTimeout(() => {
                infoToast.classList.remove('showInfoToast')
            }, 2000);
            

            //Send Welcome Email
            // $.ajax({
            //     url : '/sendWelcomeMail',
            //     type : "POST",
            //     data : {
            //         email : email,
            //         name : `${firstName}, ${lastName}`
            //     },
            //     success : function () {
            //         console.log("Email sent");
            //     }
            // })
        } catch (error){
            console.log(error)
        }
    }
}
navRegister.addEventListener('click', handleRegister)

// Handle the Login Modal
const handleLogIn = async () => {
        if(validateData(navLogInEmail) && validateData(navLogInPassword)){
            try{
            // Add Loader
            loader.classList.add('showLoader')
            //Create Request Body
            const body = {
                "email":`${navLogInEmail.value}`,
                "password":`${navLogInPassword.value}`
            }

            // Fetch options for posting JSON
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
            
            const response = await fetch(logInEndpoint, options);
            if(response.status === 500){
                infoText.innerHTML = `Login unsuccessful, Check Details`
                infoToast.classList.add('showInfoToast');
                setTimeout(() => {
                    infoToast.classList.remove('showInfoToast')
                }, 2000);
                return loader.classList.remove('showLoader')
            }

            //Valid Data Provided
            const data = await response.json();
            const {uid, token, firstName, lastName} = data
            //Store variables on client side
            localStorage.setItem('mandilasToken', `${token}`)

            postSignedInButtonContainer.children[0].innerHTML = `Hello, ${firstName}`;
            infoText.innerHTML = `Hi ${firstName}, You have successfully signed in.`
            //Remove Modal
            loginModal.style.display = "none"
            //Clear Defaults
            navLogInEmail.value = "",
            navLogInPassword.value = "",
            // Set User State to logged in
            isUserLoggedIn = true;
            //Set User ID
            USER_ID = uid
            postSignedInButtonContainer.style.display = 'flex';
            preSignedInButtonContainer.style.display = 'none';

            loader.classList.remove('showLoader')
            console.log(window.location)
            await updateCartIcon();
            window.location.reload()
            // Show the Toast
            infoToast.classList.add('showInfoToast');
            setTimeout(() => {
                infoToast.classList.remove('showInfoToast')
            }, 3000);
            
        }catch(error){
            console.log(error)
            infoText.innerHTML = `Login unsuccessful`
            infoToast.classList.add('showInfoToast');
            setTimeout(() => {
                infoToast.classList.remove('showInfoToast')
            }, 2000);
        }
    } 
}
navLogIn.addEventListener('click', handleLogIn)

const authenticateUser = async () => {
    let clientToken = localStorage.getItem('mandilasToken');
    // If theres a token stored on the client side
    try{
        if(clientToken){
            const options = {
                method: 'GET',
                headers: {
                    Authorization:`Bearer ${clientToken}`
                },
            }
            let response = await fetch(getUserInfoEndpoint, options)
            if(response.status !== 200){
                return null
            }
            let record = await response.json();
            isUserLoggedIn = true
            return record;
        }else{
            isUserLoggedIn = false
            return null
        }
    } catch (error){
        console.log(error);
    }
}
const handleNavbarLoad = async () => {
    //Initialize UI
    postSignedInButtonContainer.style.display = 'none';
    preSignedInButtonContainer.style.display = 'flex';
    let user = await authenticateUser();
    if(user){
        postSignedInButtonContainer.style.display = 'flex';
        preSignedInButtonContainer.style.display = 'none';
        postSignedInButtonContainer.children[0].innerHTML = `Hello, ${user.firstName}`;
        await updateCartIcon();
    }else{
        postSignedInButtonContainer.style.display = 'none';
        preSignedInButtonContainer.style.display = 'flex';
    }
}
window.addEventListener('load', handleNavbarLoad)

// On User LogOut
const handleLogOut = () => {
    loader.classList.add('showLoader')
    // Sign Out on Firebase
    firebase.auth().signOut()
        .then((e) => {
            console.log('userIsSignedOut')
            // Clear Token
            localStorage.removeItem('mandilasToken')
            // Update View
            postSignedInButtonContainer.style.display = 'none';
            preSignedInButtonContainer.style.display = 'flex';
            loader.classList.remove('showLoader')
            // Update User Status
            isUserLoggedIn = false;
            USER_ID = ''
            //Reload Page
            window.location.reload()
        })
        .catch(error => {
            //Handle Errors here
        })
}
navLogOut.addEventListener('click', handleLogOut)

// User clicks on homepage logo
const navbarLogo = document.querySelector('.navbar-logo')
navbarLogo.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = "../Landing Page/index.html"
})

// User clicks on Cart
navbarCart.forEach(item => {
    const redirectToCart = () => {
        window.location.href = `../Cart/index.html`;
    }
    item.addEventListener('click', redirectToCart)
})

//User clicks on his/her name
const nameContainer = document.querySelector('#nameContainer');
nameContainer.addEventListener('click', async () => {
    // Show Items
    try{
        let user = await authenticateUser();
        if(user === null){
            infoText.innerHTML = `Kindly make sure you are logged in and try again`
            infoToast.classList.add('showInfoToast');
            return setTimeout(() => {
                infoToast.classList.remove('showInfoToast')
            }, 2000);
        }
        window.location.href = "../Account Profile/index.html"

    } catch (error){
        console.log(error)
    }
})
