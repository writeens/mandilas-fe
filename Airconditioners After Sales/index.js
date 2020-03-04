const asMobility = document.querySelector('#asMobility');
const asMobilityModal = document.querySelector('.as-mobility-modal');
const handleShowMobilityModal = () => {
    asMobilityModal.style.display = "flex"
}
asMobility.addEventListener('click', handleShowMobilityModal)

//Close Mobility After Sales Modal
const closeAsMobilityModal = document.querySelector('#closeAsMobilityModal');
const handleCloseAsMobilityModal = () => {
    asMobilityModal.style.display = "none"
}
closeAsMobilityModal.addEventListener('click', handleCloseAsMobilityModal)