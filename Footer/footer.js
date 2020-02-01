/**Footer */
const footerSelectors = document.querySelectorAll('.footer-topic')
const footerLinks = document.querySelectorAll('.footer-links')
footerSelectors.forEach((item, index, arr) => {
    item.addEventListener('click', () => {
        footerLinks[index].classList.toggle('hide-footer-links')
    })
})

const copyrightText = document.querySelector('.copyright > p');
window.addEventListener('load', () => {
    const currentYear = new Date().getFullYear();
    copyrightText.innerHTML = `${currentYear} Mandilas. All Rights Reserved`
})
/**Footer */