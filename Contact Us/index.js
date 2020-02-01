/**Contact Us Button Page Navigation */
const contactUsButtons = document.querySelectorAll('.contact-us-section-buttons > button')
const contactForAC = document.querySelector('.contact-us-for-ac');
const contactForMotors = document.querySelector('.contact-us-for-motors');
let contactUsState = "ac"
const handleContactUsButton = (elem, index, arr) => {
    console.log(elem)
    if(index === 0){
        if(contactUsState !== "ac"){
            elem.classList.toggle('contact-active');
            arr[1].classList.toggle('contact-active');
            contactForAC.style.display = 'flex'
            contactForMotors.style.display = 'none'
            contactUsState = "ac"
        }
    } else if(index === 1){
        if(contactUsState !== "motors"){
            elem.classList.toggle('contact-active');
            arr[0].classList.toggle('contact-active')
            contactForMotors.style.display = 'flex'
            contactForAC.style.display = 'none'
            contactUsState = "motors"
        }
    }
}
contactUsButtons.forEach((item, index, arr) => {
    item.addEventListener('click', () => {handleContactUsButton(item, index, arr)})
})