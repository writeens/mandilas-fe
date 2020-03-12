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
const specSheetHead = document.querySelector('#specSheetHead');
const motorsDetailModal = document.querySelector('#motorsDetailModal');
const motorsExteriorGallery = document.querySelector('#motorsExteriorGallery')
const motorsInteriorGallery = document.querySelector('#motorsInteriorGallery')
const imageCarouselContainer = document.querySelector('#mdImageContainer');

// Create Spec Sheet
specSheetBody.innerHTML = "";
specSheetHead.innerHTML = "";
const createSpecSheet = (data) => {
    let newData = Object.values(data);
    newData.map(item => {
        const tr = document.createElement('tr');
        item.map(innerItem => {
            const td = document.createElement('td');
            td.innerHTML = innerItem;
            tr.append(td)
        })
        specSheetBody.append(tr);
    })
    const thtr = document.createElement("tr");
    newData[0].map((item, index) => {
        let th = document.createElement('th')
        if(index === 0){
            th.innerHTML = "Specifications"
        }
        thtr.append(th);
    })
    specSheetHead.append(thtr);
}

// Create Basic Information
const displayVehicleInformation = (data) => {
    let {name, overview, images, summary, colors, description, specSheet} = data;
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
    vehicleLargeImage.src = images.main;
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

const closeGallery = document.querySelector('#closeGallery')
closeGallery.addEventListener('click', () => {
    motorsDetailModal.style.display = "none";
})

const updateGallery = (type) => {
    motorsDetailModal.style.display = "flex";
    const { images } = ITEM
    let photos = Object.values(images[type]);
    imageCarouselContainer.innerHTML = ""
    photos.map((item, index) => {
        const div = document.createElement('div');
        div.classList.add('carousel-item')
        if(index === 0){
            div.classList.add('active')
        }
        const img = document.createElement('img');
        img.src = item;
        div.append(img);
        imageCarouselContainer.append(div);
    })
}
motorsInteriorGallery.addEventListener('click', () => updateGallery("interior"))
motorsExteriorGallery.addEventListener('click', () => updateGallery("exterior"))