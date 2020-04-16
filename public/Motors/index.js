
/**Handle New Vehicle and 
 * Used Vehicle Buttons on Motors Page */
const motorsButtons = document.querySelectorAll('.motors-buttons > button');
const oldVehicles = document.querySelector('.old-vehicles');
const newVehicles = document.querySelector('.new-vehicles');
const closeUsedCarsModal = document.querySelector('#closeUsedCarsModal');
const usedCarsModal = document.querySelector('#usedCarsModal');
const usedModalName = document.querySelector('#usedModalName')
const usedModalSummary = document.querySelector('#usedModalSummary')
const usedModalImage = document.querySelector('#usedModalImage');
const usedModalPrice = document.querySelector('#usedModalPrice');
const usedModalMileage = document.querySelector('#usedModalMileage');
const usedModalColor = document.querySelector('#usedModalColor');



//Generate Used Vehicle
const usedCarsContainer = document.querySelector('#usedCarsContainer');
usedCarsContainer.innerHTML = "";
const generateUsedVehicle = (data) => {
    usedCarsContainer.innerHTML = "";
    let newData = Object.values(data)
    if(newData.length > 0){
        newData.map(item => {
            createVehicleItem(item)
        })
    }else{
        let p = document.createElement('p');
        p.innerText = 'There are no used cars matching this criteria.';
        p.style.fontSize = '1.5rem';
        usedCarsContainer.appendChild(p);
    }
}

/**Used Car Modal Control */
const populateModal = (data) => {
    const {year, make, model, summary, image, color, mileage, price} = data;
    usedModalImage.src = image;
    usedModalName.innerHTML = `${make} ${model} ${year}`;
    usedModalPrice.innerHTML = formatter.format(price);
    usedModalSummary.innerHTML = summary.join(', ');
    usedCarsModal.style.display = 'flex';
    usedModalMileage.innerHTML = mileage;
    usedModalColor.innerHTML = color
}
/**Used Car Modal Control */

/**Close Modal */
closeUsedCarsModal.addEventListener('click', () => {
    usedCarsModal.style.display = "none";
})
/**Close Modal */

const createVehicleItem = (vehicle) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits : 6,
        minimumFractionDigits : 0
    })
    const {year, make, model, summary, image, color, mileage, price} = vehicle
    let itemContainer = document.createElement('div');
    itemContainer.classList.add('motors-uv-item');
    let itemImage = document.createElement('img');
    itemImage.src = image;
    let title = document.createElement('p');
    title.innerHTML = `${make} ${model} ${year}`;
    let itemPrice = document.createElement('p')
    itemPrice.innerHTML = formatter.format(price);

    itemContainer.addEventListener('click',() => populateModal(vehicle));

    itemContainer.append(itemImage, title, itemPrice);
    usedCarsContainer.append(itemContainer)
}

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
            generateUsedVehicle(USED_CARS);
            generateVehicleYears(USED_CARS);
        }
    }
}
motorsButtons.forEach((item, index, arr) => {
    item.addEventListener('click', () => {handleMotorsButtons(item, index, arr)})
})

//Generate Vehicle Years
const selectYear = document.querySelector('#selectYear');
const generateVehicleYears = (data) => {
    let years = []
    years = Object.values(data).map(item => item.year);
    years.sort((a, b) => a - b);
    let finalYears = new Set(years);
    years = [];
    for(let item of finalYears){
        years.push(item)
    }
    selectYear.innerHTML = "";
    let defaultOption = document.createElement('option');
    defaultOption.value = 0;
    defaultOption.innerText = "Year";
    selectYear.appendChild(defaultOption)
    //Display Years
    years.map(item => {
        let option = document.createElement('option');
        option.innerText = item;
        option.value = item;

        selectYear.appendChild(option);
    })
}


const handleMotorsLoad = () => {
    let params = new URLSearchParams(window.location.search.substring(1));
    let id = params.get('id');
    if(id === "usedVehicles"){
        newVehicles.style.display = "none";
        oldVehicles.style.display = "flex";
        vehicleState = "used"
        generateUsedVehicle(USED_CARS);
        generateVehicleYears(USED_CARS);
        motorsButtons[0].classList.toggle('motors-button-active');
        motorsButtons[1].classList.toggle('motors-button-active');
    }
}
window.addEventListener('load', handleMotorsLoad)

//Handle Clicking on New Vehicle Item
const newVehicleItems = document.querySelectorAll('.motors-nv-item');
const handleNewVehicleItemClick = (index) => {
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
        if(data === null){
            celebrationModalMotors.style.display = "flex"
            sessionStorage.setItem('shownCelebrationMotors', 'true');
        }
    }, 5000);
})
/**Celebration Modal Control */

//Populate Select Model
const selectModel = document.querySelector('#selectModel');
const populateSelectModel = (make, data) => {
    selectModel.innerHTML = "";
    data[make].map(item => {
        let option = document.createElement('option');
        option.innerText = item;
        option.value = item.toLowerCase();
        selectModel.appendChild(option);
    })
}

//Handling Select Make Change
const selectMake = document.querySelector('#selectMake');
const handleSelectMakeChange = (e) => {
    let make = e.target.options[e.target.selectedIndex];
    populateSelectModel(make.value, CAR_MODELS);
}
selectMake.addEventListener('change', handleSelectMakeChange);


/**Handling Search Button */
const handleFilterUsedCars = () => {
    let make = selectMake.value;
    let model = selectModel.value;
    let year = parseInt(selectYear.value);
    let data = Object.values(USED_CARS);
    if(make === "" && model === "" && year !== ""){
        data = data.filter(item => item.year === year);
    }else if(make !== "" && model !== "" && year !== 0){
        data = data.filter(item => {
            return item.make.toLowerCase() === make && item.model.toLowerCase() === model && item.year === year
        })
    }else if(make !== "" && model !== "" && year === 0){
        data = data.filter(item => {
            return item.make.toLowerCase() === make && item.model.toLowerCase() === model
        })
    }
    usedCarsContainer.innerHTML = "";
    generateUsedVehicle(data)
}
const filterUsedCars = document.querySelector('#filterUsedCars');
filterUsedCars.addEventListener('click', handleFilterUsedCars)

/**Handling Search Button */

const usedToContact = document.querySelector('#usedToContact');
usedToContact.addEventListener('click', () => {
    window.location.href = '../Contact Us/index.html';
})

