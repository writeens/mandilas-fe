console.log("working");

let chatBotFirstOpen = 0
let name = ""
let email = ""

$("#messageEntryForm").submit(function(e) {
  const message = document.getElementById("messageInput").value
  console.log(message);
  const userMessage = document.createElement("p")
  userMessage.innerHTML = message
  userMessage.style.display = "inline-block"
  userMessage.style.marginLeft = "auto"
  userMessage.style.marginRight = "15px"
  userMessage.style.marginTop = "15px"
  userMessage.style.padding = "15px"
  userMessage.style.backgroundColor = "#43b7a1"
  userMessage.style.borderStyle = "none"
  userMessage.style.borderRadius = "10px"
  userMessage.style.color = "white"
  userMessage.style.textAlign = "right"

  const typingIcon = document.createElement("img")
  typingIcon.src = "/assets/typing.svg"
  typingIcon.style.marginLeft = "20px"
  typingIcon.style.marginTop = "20px"

  document.getElementById("messageArea").appendChild(userMessage)
  document.getElementById("messageArea").appendChild(typingIcon)
  document.getElementById('messageInput').value = ""

  $('#messageArea').stop().animate({
    scrollTop: $('#messageArea')[0].scrollHeight
  }, 800)





  console.log("submitted");
  e.preventDefault();
  console.log("sending");
  $.ajax({
    url: "/",
    type: "POST",
    data: {
      'message': message

    },
    success: function(data) {
      const welcomeMessage = document.createElement("p")
      welcomeMessage.innerHTML = data.cityID
      welcomeMessage.style.padding = "15px"
      welcomeMessage.style.backgroundColor = "#eaeaea"
      welcomeMessage.style.borderStyle = "none"
      welcomeMessage.style.borderRadius = "10px"
      welcomeMessage.style.color = "black"
      welcomeMessage.style.margin = "10px"

      document.getElementById("messageArea").removeChild(typingIcon)
      document.getElementById("messageArea").appendChild(welcomeMessage)
      console.log(data.cityID);

      $('#messageArea').stop().animate({
    scrollTop: $('#messageArea')[0].scrollHeight
  }, 800)
    }
  });
});



function createWelcomeMessages() {
  const typingIcon = document.createElement("img")
  typingIcon.src = "/assets/typing.svg"
  typingIcon.style.marginLeft = "20px"
  typingIcon.style.marginTop = "20px"
  document.getElementById("messageArea").appendChild(typingIcon)


  setTimeout(() => {
    document.getElementById("messageArea").removeChild(typingIcon)
    const welcomeMessage = document.createElement("p")
    welcomeMessage.innerHTML = `Hi ${name}. Welcome to Mandilas Group. How may I be of help?`
    welcomeMessage.style.padding = "15px"
    welcomeMessage.style.backgroundColor = "#eaeaea"
    welcomeMessage.style.borderStyle = "none"
    welcomeMessage.style.borderRadius = "10px"
    welcomeMessage.style.color = "black"
    welcomeMessage.style.margin = "10px"

    const complaintButton = document.createElement("button")
    const enquiryButton = document.createElement("button")
    const buttonsDiv = document.createElement("div")

    buttonsDiv.style.paddingLeft = "20px"

    complaintButton.style.paddingLeft = "20px"
    complaintButton.style.paddingRight = "20px"
    complaintButton.style.paddingTop= "10px"
    complaintButton.style.paddingBottom = "10px"
    complaintButton.style.borderStyle = "none"
    complaintButton.style.borderRadius = "8px"
    complaintButton.style.color = "white"
    complaintButton.style.backgroundColor = "black"
    complaintButton.setAttribute("uk-toggle","target: #my-id")

    // complaintButton.addEventListener("click", () => {
    //   $('#complaintModal').modal('show')
    // })


    enquiryButton.style.paddingLeft = "20px"
    enquiryButton.style.paddingRight = "20px"
    enquiryButton.style.paddingTop= "10px"
    enquiryButton.style.paddingBottom = "10px"
    enquiryButton.style.marginLeft = "10px"
    enquiryButton.style.borderStyle = "none"
    enquiryButton.style.borderRadius = "8px"
    enquiryButton.style.color = "white"
    enquiryButton.style.backgroundColor = "#43b7a1"



    complaintButton.innerHTML = "Complaints"
    enquiryButton.innerHTML = "Enquiries"


    enquiryButton.addEventListener("click", () => {





      document.getElementById("messageArea").appendChild(typingIcon)


      $('#messageArea').stop().animate({
        scrollTop: $('#messageArea')[0].scrollHeight
      }, 800)


      $.ajax({
        url: "/",
        type: "POST",
        data: {
          'message': "User is making an enquiry"

        },
        success: function(data) {
          const welcomeMessage = document.createElement("p")
          welcomeMessage.innerHTML = data.cityID
          welcomeMessage.style.padding = "15px"
          welcomeMessage.style.backgroundColor = "#eaeaea"
          welcomeMessage.style.borderStyle = "none"
          welcomeMessage.style.borderRadius = "10px"
          welcomeMessage.style.color = "black"
          welcomeMessage.style.margin = "10px"

          document.getElementById("messageArea").removeChild(typingIcon)
          document.getElementById("messageArea").appendChild(welcomeMessage)
          console.log(data.cityID);

          $('#messageArea').stop().animate({
        scrollTop: $('#messageArea')[0].scrollHeight
      }, 800)
        }
      });
    })





    document.getElementById("messageArea").appendChild(welcomeMessage)
    document.getElementById("messageArea").appendChild(buttonsDiv)

    buttonsDiv.appendChild(complaintButton)
    buttonsDiv.appendChild(enquiryButton)
  },2000)
}


let chatbotOpen = 0


document.getElementById("openCloseChatbotIcon").addEventListener("click", () => {
  // if(chatBotFirstOpen == 0){
  //   setTimeout(() => {
  //     createWelcomeMessages()
  //     chatBotFirstOpen = 1
  //   },2000)
  // }else{
  //
  // }
  if (chatbotOpen == 0) {
    $("#messageBox").animate({height: "50vh"});
    document.getElementById('messageBox').style.display = 'block'
    chatbotOpen = 1
  } else {
    $("#messageBox").animate({height: "0px"});
    setTimeout(() => {
      document.getElementById('messageBox').style.display = 'none'
    },300)

    chatbotOpen = 0
  }
})


document.getElementById("closeChatbotIcon").addEventListener("click", () => {
  $("#messageBox").animate({height: "0px"});
  setTimeout(() => {
    document.getElementById('messageBox').style.display = 'none'
  },300)

  chatbotOpen = 0
})


document.getElementById("messageSubmitDetailsButton").addEventListener("click", () => {
  name = document.getElementById("messageNameEntry").value
  email = document.getElementById("messageEmailEntry").value

  if(name == "" || name == null){
    document.getElementById("preMessageError").innerHTML = "Please enter your name"
    document.getElementById("preMessageError").style.display = "block"

    setTimeout(() => {
      document.getElementById("preMessageError").style.display = "none"
    },3000)
  }else if(email == "" || email == null){
    document.getElementById("preMessageError").innerHTML = "Please enter your email address"
    document.getElementById("preMessageError").style.display = "block"

    setTimeout(() => {
      document.getElementById("preMessageError").style.display = "none"
    },3000)
  }else{
    document.getElementById('preMessageForm').style.display = "none"
    document.getElementById('messageAreaAndEntry').style.display = "block"
    createWelcomeMessages()
  }
})
