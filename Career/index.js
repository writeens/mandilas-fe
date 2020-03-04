const closeRolesModal = document.querySelector('#closeRolesModal');
const rolesModal = document.querySelector('.roles-modal-bg');
const handleCloseRolesModal = () => {
    rolesModal.style.display = "none";
}
closeRolesModal.addEventListener('click', handleCloseRolesModal)

//Click on Department Item
const department = document.querySelectorAll('.roles-category-item');
const handleShowRolesModal = (elem) => {
    rolesModal.style.display = "flex";
}
department.forEach(item => {
    item.addEventListener('click', () => handleShowRolesModal(item))
})