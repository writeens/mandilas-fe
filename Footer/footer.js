/**Footer */
const footerSelectors = document.querySelectorAll('.footer-topic')
const footerLinks = document.querySelectorAll('.footer-links')
footerSelectors.forEach((item, index, arr) => {
    item.addEventListener('click', () => {
        footerLinks[index].classList.toggle('hide-footer-links')
    })
})
/**Footer */