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


// Handle Service Booking
const goToServiceBooking = document.querySelector('#goToServiceBooking');

const handleServiceBooking = async (e) => {
    e.preventDefault()
    let user = await authenticateUser();
    console.log(user)
    if(!user){
        asMobilityModal.style.display = "none";
        loginModal.style.display = "flex"
        return
    }
    location.href = '../Account Profile/index.html';
}
goToServiceBooking.addEventListener('click', handleServiceBooking)