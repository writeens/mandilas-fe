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

const initializeLocalStorage = () => {
    // console.log(localStorage.getItem('mandilasCart'))
    // console.log(localStorage.getItem('mandilasToken'))
    const cart = localStorage.getItem('mandilasCart');
    const token = localStorage.getItem('mandilasToken');
    if(cart === null){
        localStorage.setItem("mandilasCart", JSON.stringify([]))
    }
    if(token === null){
        localStorage.setItem("mandilasToken", JSON.stringify(""))
    }
    console.log(localStorage.getItem('mandilasCart'))
    console.log(localStorage.getItem('mandilasToken'))
}
initializeLocalStorage();

/**Desktop Menu */
const menuItems = document.querySelectorAll('.hometwo-menu-item.drop')
menuItems.forEach((menuItem, outerIndex, arr) => {
    menuItem.addEventListener('click', () => {
        if(window.innerWidth >= 940){
            arr.forEach((item, innerIndex) => {
                if(innerIndex !== outerIndex){
                    item.children[1].classList.add('hometwo-submenu-hide')
                }
            })
            menuItem.children[1].classList.toggle('hometwo-submenu-hide')
        }else{
            arr.forEach((item, innerIndex) => {
                if(innerIndex !== outerIndex){
                    item.children[1].classList.add('hometwo-submenu-hide')
                }
            })
            menuItem.children[1].classList.toggle('hometwo-submenu-hide')
        }
    })
})

let isUserLoggedIn = null;
const toggle = document.querySelector('.hometwo-toggle');
const menu = document.querySelector('.hometwo-menu');
const navbarButtons = document.querySelector('#hometwo-navbar-buttons');
const navFirstName = document.querySelector('#navbarFirstName')
const navLastName = document.querySelector('#navbarLastName')
const navEmail = document.querySelector('#navbarEmail')
const navPassword = document.querySelector('#navbarPassword')
const navPhoneNumber = document.querySelector('#navbarPhoneNumber')
const navRegister = document.querySelector('#navbarRegister')
const navLogIn = document.querySelector('#navbarLogIn');
const navLogInEmail = document.querySelector('#navLogInEmail')
const navLogInPassword = document.querySelector('#navLogInPassword')
// Log Out Buttons
const navLogOut = document.querySelector('#navLogOut')
//Pre Sign In Buttons
const preSignedInButtonContainer = document.querySelector('.hometwo-buttons')
//Post Sign In Buttons
const postSignedInButtonContainer = document.querySelector('.hometwo-signedin-buttons')
//Loader
const loader = document.querySelector('#loader')
//Message Toast
const toast = document.querySelector('#messageToast');
//Client Side Validation
const signUpEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/sign-up'
const logInEndpoint = 'https://peaceful-river-39598.herokuapp.com/api/v1/mandilas/auth/sign-in'

//Hamburger Menu
toggle.addEventListener('click', () => {
    const hamburgerPresent = toggle.children[0].classList.contains('fa-bars')
    const closeIconPresent = toggle.children[0].classList.contains('fa-close')
    if(hamburgerPresent){
        console.log("showing Menu")
        toggle.children[0].classList.remove('fa-bars');
        toggle.children[0].classList.add('fa-close');
        
    }
    if(closeIconPresent){
        console.log("hiding Menu")
        toggle.children[0].classList.remove('fa-close');
        toggle.children[0].classList.add('fa-bars');
    }
    navbarButtons.classList.toggle('show-item');
    menu.classList.toggle('show-item');
})
/**Desktop Menu */

/**Homepage Modal Close*/
const closeLoginModal = document.querySelector('.sl-login-close')
const closeSignUpModal = document.querySelector('.sl-signup-close')
closeLoginModal.addEventListener('click', () => {
    $('#login').modal('hide')
})
closeSignUpModal.addEventListener('click', () => {
    $('#signUp').modal('hide')
})
/**Homepage Modal Close*/


/**GLOBAL VARIABLES */
/**Communication With Server */
const shakeInput = (elem) => {
    elem.classList.add('shake')
    elem.classList.add('invalid-input')
    setTimeout(() => {
        elem.classList.remove('shake')
        elem.classList.remove('invalid-input')
    }, 500);
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

const handleRegister = () => {
    validateData(navFirstName)
    validateData(navLastName)
    validateData(navEmail)
    validateData(navPassword)
    validateData(navPhoneNumber)
    if(validateData(navFirstName) &&
    validateData(navLastName) &&
    validateData(navEmail) &&
    validateData(navPassword)){
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
        fetch(signUpEndpoint, options)
            .then(response => {
                return response.json()
            })
            .then(data => {
                loader.classList.remove('showLoader')
                if(data.status === "success"){
                    const {name, email, token} = data.data
                    //Store variables on client side
                    localStorage.setItem('mandilasToken', `${token}`)
                    toast.children[0].innerHTML = `Hi ${body["firstName"]}, You have successfully registered`
                    postSignedInButtonContainer.children[0].innerHTML = `Hello, ${body["firstName"]}`;
                    //Remove Modal
                    $('#signUp').modal('hide')
                    // Show Pre Login View
                    postSignedInButtonContainer.style.display = 'flex';
                    preSignedInButtonContainer.style.display = 'none';
                    //Clear Defaults
                    navFirstName.value = "",
                    navLastName.value = "",
                    navEmail.value = "",
                    navPhoneNumber.value = "",
                    navPassword.value = "",
                    // Set User State to logged in
                    isUserLoggedIn = true;
                }
                if(data.status === "error" && data.code === "MAIL_EXISTS"){
                    toast.children[0].innerHTML = `Hi ${body["firstName"]}, this email already exists`;
                }
                toast.classList.add('showMessageToast');
                    setTimeout(() => {
                        toast.classList.remove('showMessageToast')
                    }, 2000);
            })
    }
}
navRegister.addEventListener('click', handleRegister)

const handleLogIn = () => {
    validateData(navLogInEmail);
    validateData(navLogInPassword);
    if(validateData(navLogInEmail) && validateData(navLogInPassword)){
        // Add Loader
        loader.classList.add('showLoader')
        //Create Request Body
        const body = {
            "email":navLogInEmail.value,
            "password":navLogInPassword.value
        }
        // Fetch options for posting JSON
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        fetch(logInEndpoint, options)
            .then(response => {
                return response.json()
            })
            .then(data => {
                loader.classList.remove('showLoader')
                if(data.status === 'success'){
                    const {displayName, email, customToken} = data.data;
                    let firstName = `${displayName}`.split(' ')[1]
                    toast.children[0].innerHTML = `Hi ${firstName}, You have successfully signed in.`
                    postSignedInButtonContainer.children[0].innerHTML = `Hello, ${firstName}`;
                    localStorage.setItem('mandilasToken', `${customToken}`);
                    //Remove Modal
                    $('#login').modal('hide')
                    
                    //Clear Defaults
                    navLogInEmail.value = "",
                    navLogInPassword.value = "",
                    // Set User State to logged in
                    isUserLoggedIn = true;
                    postSignedInButtonContainer.style.display = 'flex';
                    preSignedInButtonContainer.style.display = 'none';
                }
                if(data.status === 'error' && data.code === 'INVALID PASSWORD'){
                    toast.children[0].innerHTML = `The password you entered is incorrect.`
                }
                if(data.status === 'error' && data.code === 'INVALID EMAIL'){
                    toast.children[0].innerHTML = `The email you entered does not exist. Try signing up.`
                }
                // Show the Toast
                toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 3000);
            })
            .catch(error => {
                console.log(error)
            })
    }
}
navLogIn.addEventListener('click', handleLogIn)

/**Communication With Server */

const cartNumber = document.querySelectorAll('.navbar-cart-container > .no-of-items')
// On Page Load, Check If Token exists client-side.
const handlePageLoad = () => {
    //Initialize UI
    postSignedInButtonContainer.style.display = 'none';
    preSignedInButtonContainer.style.display = 'flex';
    
    // Handle Cart Icon
    let numOfItems = JSON.parse(localStorage.getItem('mandilasCart'));
    cartNumber.forEach(item => item.innerHTML = numOfItems.length)

    let clientToken = localStorage.getItem('mandilasToken');
    // If theres a token stored on the client side
    if((clientToken) && (clientToken !== 'undefined')){
        // Sign In with that token
        firebase.auth().signInWithCustomToken(clientToken)
        .then((record) => {
            let firstName = `${record.user.displayName}`.split(' ')[0];
            postSignedInButtonContainer.children[0].innerHTML = `Hello, ${firstName}`;
            toast.children[0].innerHTML = `Welcome back, ${firstName}`
            isUserLoggedIn = true;
            // Show Post Login View
            postSignedInButtonContainer.style.display = 'flex';
            preSignedInButtonContainer.style.display = 'none';

            // Display Message
            toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 3000);
        })
        .catch(error => {
            console.log(error)
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if(errorCode === "auth/invalid-custom-token"){
                // Handle Buttons

                loader.classList.remove('showLoader')
                toast.children[0].innerHTML = `You have been signed out`
                toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 3000);
            }
            if(errorCode === "auth/network-request-failed"){
                loader.classList.remove('showLoader')
                toast.children[0].innerHTML = `Check your network and try again`
                toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 3000);
            }
            });
    } else{
        
    }
}
window.addEventListener('DOMContentLoaded', handlePageLoad)

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
        })
        .catch(error => {
            //Handle Errors here
        })
}
navLogOut.addEventListener('click', handleLogOut)

//Handle Cart Icon
const cart = document.querySelectorAll('.navbar-cart-container');
const handleCartIcon = () => {
    let cart = JSON.parse(localStorage.getItem('mandilasCart'));
    //If Cart is Empty
    if(cart.length <= 0){
        toast.children[0].innerHTML = `There are no items in your cart, try adding some.`;
            toast.classList.add('showMessageToast');
                setTimeout(() => {
                    toast.classList.remove('showMessageToast')
                }, 2000);
    } else if(cart.length > 0){
        if(ENV === 'development'){
            window.location.href = `/Cart/index.html`
        }else{
            window.location.href = `../Cart/index.html`
        }
    }
}
cart.forEach(item => {
    item.addEventListener('click', handleCartIcon)
})