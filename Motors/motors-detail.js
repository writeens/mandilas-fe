//Global Variable
let ITEM ={};

//DOM ELEMENTS
const vehicleName = document.querySelector('#vehicleName');
const vehicleStructure = document.querySelector('#vehicleStructure');
const vehicleType = document.querySelector('#vehicleType');
const vehicleSummary = document.querySelector('#vehicleSummary')
const vehiclePaletteContainer = document.querySelector('#vehiclePaletteContainer');
const vehicleDescription = document.querySelector('#vehicleDescription');
const vehicleLargeImage = document.querySelector('#vehicleLargeImage');
const specSheetBody = document.querySelector('#specSheetBody');
// Create Spec Sheet
const createSpecSheet = (data) => {
    let newData = Object.values(data);
    console.log(newData);
    newData.map(item => {
        const tr 
    })
}

// Create Basic Information
const displayVehicleInformation = (data) => {
    let {name, overview, image, summary, colors, description, specSheet} = data;
    console.log(data)
    vehicleName.innerHTML = name;
    vehicleStructure.innerHTML = overview.motorStructure;
    vehicleFuel.innerHTML = overview.engineFuelType;
    vehicleType.innerHTML = overview.motorType;
    summary.map(item => {
        let p = document.createElement('p');
        p.innerHTML = `&bull; ${item}`;
        vehicleSummary.append(p);
    })
    colors.map(item => {
        let p = document.createElement('p');
        p.classList.add('palette');
        p.style.backgroundColor = item;
        vehiclePaletteContainer.append(p);
    })
    vehicleLargeImage.src = image.main;
    vehicleDescription.innerHTML = description;
    createSpecSheet(specSheet);
}

//Handle Page Load
const handleMotorsDetailPageLoad = () => {
    let params = new URLSearchParams(window.location.search.substring(1));
    let id = params.get('id');
    id = parseInt(id);
    ITEM = MOTORS[id];
    displayVehicleInformation(ITEM);
}
window.addEventListener('load', handleMotorsDetailPageLoad)