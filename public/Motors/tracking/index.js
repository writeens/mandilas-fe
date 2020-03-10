let trackingID = ""

console.log("something");

document.getElementById("trackServiceButton").addEventListener("click", () => {
  console.log("clicked");
  trackingID = document.getElementById("trackingIdInput").value
  console.log(trackingID);

  if(trackingID != null && trackingID != ""){
    document.getElementById("loadingDiv").style.display = "flex"
    $.ajax({
      url: "/accountProfile",
      type: "POST",
      data: {
        'trackingID': trackingID

      },
      success: function(data) {

        document.getElementById("trackingResultsDiv").style.display = "block"
        document.getElementById("loadingDiv").style.display = "none"
        document.getElementById("pickUpDate").innerHTML = data.serviceListObject.pickUpDate
        document.getElementById("vehicleReg").innerHTML = data.serviceListObject.vehicleReg
        document.getElementById("ownerName").innerHTML = data.serviceListObject.customerName
        document.getElementById("dropOffDate").innerHTML = data.serviceListObject.dropOffDate
        document.getElementById("vehicleBrand").innerHTML = data.serviceListObject.vehicleBrand
        document.getElementById("vehicleModel").innerHTML = data.serviceListObject.vehicleModel
        document.getElementById("vehicleColor").innerHTML = data.serviceListObject.vehicleColor


        const obj = Object.keys(data.serviceListObject.maintenanceWorks)

        console.log(data.serviceListObject.maintenanceWorks);



        let count = 0
        let completedCount = 0

        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {

            if(data.serviceListObject.maintenanceWorks[obj[key]].status == "Completed"){
              ++completedCount
            }

            loadServiceDetails(data.serviceListObject.maintenanceWorks[obj[key]], count)
            ++count
          }
        }

        console.log(count);
        console.log(completedCount);
        console.log(Math.round((completedCount/count) * 100));

        progressBar.value = Math.round((completedCount/count) * 100)
        progressText.innerHTML = Math.round((completedCount/count) * 100) + "%"






      }
    });
  }


})

function loadServiceDetails(serviceObject, thisCount) {
  console.log(serviceObject);

  const detailContainer = document.createElement("div")
  const detailStatusImage = document.createElement("img")
  const detailsText = document.createElement("span")

  detailContainer.style.display = "flex"

  detailStatusImage.style.marginTop = "auto"
  detailStatusImage.style.marginBottom = "auto"
  detailStatusImage.style.marginRight = "10px"

  detailsText.style.marginTop = "auto"
  detailsText.style.marginBottom = "auto"
  detailsText.paddingLeft = "15px"
  detailsText.fontSize = "25px"

  detailContainer.style.marginTop = "30px"

  detailsText.innerHTML = serviceObject.maintenanceWork
  if(serviceObject.status == "Pending"){
    detailStatusImage.src = "pending.svg"
  }else if (serviceObject.status == "In Progress"){
    detailStatusImage.src = "inprogress.svg"
  }else{
    detailStatusImage.src = "completed.svg"
  }

  detailStatusImage.style.width = "30px"

  detailContainer.appendChild(detailStatusImage)
  detailContainer.appendChild(detailsText)

  if (thisCount%2 == 0) {
    detailsList1.appendChild(detailContainer)
  }else{
    detailsList2.appendChild(detailContainer)
  }



}
