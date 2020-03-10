/**Handle New Vehicle and 
 * Used Vehicle Buttons on Motors Page */
const motorsButtons = document.querySelectorAll('.motors-buttons > button');
const oldVehicles = document.querySelector('.old-vehicles');
const newVehicles = document.querySelector('.new-vehicles');
//Handle Motors Buttons Click
let vehicleState = 'new'
const handleMotorsButtons = (item, index, arr) => {
    // When New Vehicles is clicked
    if(index === 0){
        //Check Vehicle State
        if(vehicleState !== 'new'){
            item.classList.toggle('motors-button-active');
            arr[1].classList.toggle('motors-button-active');
            newVehicles.style.display = "flex"
            oldVehicles.style.display = "none"
            vehicleState = 'new'
        }
    }else if(index === 1){
        if(vehicleState !== 'used'){
            item.classList.toggle('motors-button-active')
            arr[0].classList.toggle('motors-button-active')
            vehicleState = 'used'
            oldVehicles.style.display = "flex"
            newVehicles.style.display = "none"
        }
    }
}
motorsButtons.forEach((item, index, arr) => {
    item.addEventListener('click', () => {handleMotorsButtons(item, index, arr)})
})

const handleMotorsLoad = () => {
    let params = new URLSearchParams(window.location.search.substring(1));
    let id = params.get('id');
    if(id === "usedVehicles"){
        newVehicles.style.display = "none";
        oldVehicles.style.display = "flex";
        vehicleState = "used"
        motorsButtons[0].classList.toggle('motors-button-active');
        motorsButtons[1].classList.toggle('motors-button-active');
    }
}
window.addEventListener('load', handleMotorsLoad)

//Handle Clicking on New Vehicle Item
const newVehicleItems = document.querySelectorAll('.motors-nv-item');
const handleNewVehicleItemClick = (index) => {
    console.log(index)
    location.href = `motors-detail.html?id=${index}`;
}
newVehicleItems.forEach((item, index) => {
    item.addEventListener('click', () => handleNewVehicleItemClick(index))
})


/**Celebration Modal Control */
const closeCelebrationMotors = document.querySelector('#closeCelebrationMotors');
const celebrationModalMotors = document.querySelector('.celebration-modal-motors')
closeCelebrationMotors.addEventListener('click', () => {
    celebrationModalMotors.style.display = "none";
})
window.addEventListener('load', () => {
    setTimeout(() => {
        let data = sessionStorage.getItem('shownCelebrationMotors')
        console.log(data)
        if(data === null){
            celebrationModalMotors.style.display = "flex"
            sessionStorage.setItem('shownCelebrationMotors', 'true');
        }
    }, 5000);
})
/**Celebration Modal Control */
