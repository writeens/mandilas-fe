const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDpU9sJCdCAeHeU\nY3spSA6XFjfurP9F0CJdkM9+cqSYuW498pp+ZWCDcRsGsFGWIczS/39GNHjuC2PM\n863xFdVTTlslUrmXhkRuf6f2VF6bVJ+BVPs1s1MaIUHs1iOfjFtTWXEQGbSPoTBz\nbX1+2oaIH87D25x3TxGDUnqS/6TvTRY9xJQ+H72HHRZ/Ik8xXINN9kqRULejeVpf\nlbs02tI3eOX10nWZ7MaB8fbtYec8x/cdbFWaJmB+vACHQIXu0MZexqjptZc4T/Og\nUaZsXFM8o+6Fz2OSXniSLfkkAVNRMSlYRt8IBR2m9dr074WX549TayvgY5B1GvLn\ns+4oFMD7AgMBAAECggEAJ5zvfnjWl8EcGCrNkaQkqf0BMPnY+wrLktQPjjm7fRxa\nPZUvKo9ek+JDgt6zc0g4xIfRHWOyNkPjxTuHx/r7dUHD0rHZRYLrolD0/Kq1RyzW\nSbhaT/MqhDCqRyHR+Xf0V1HDksayc4IbvjUUDdHe7kRsL69cwJrBb+i0W7mgUGoU\ngLAJBjLLZCiHqJbVWNggkmVObgFAdCDSZoCgSL7d6Xr0RSQQprIiPmFge0Zb1aMo\nwuJZfNm+IDepWq7j3AUiUGN9VDD5pwg6VCMU6EioFdlE6QsdK+qIJBm+DS79H7d/\nFUFVGrpy1SXOKWUAFGI03NFRvsK0dsu4YO327TfkQQKBgQD4+dJttrA3CRadMbjH\nDN0+wR2JeWU2feWy5lxjSVKU7yBuyRVed51b7X2s4GLizw6ek1LUt+zVkIH5EJh7\nbxZfdxUMC5eywb45aiuxLlFnxXZnXk9wdxhPfEgp+S0XBIntOWQX1Bv4o9fZ339p\nNwcg1QdWwXzyHagflz2Ty65eQQKBgQDv6QRScjnv9nCvACmg0JBmNebZzAjxwFid\nWp9gvyJvr3iaJRqN33zwdsJtlVWj8a/zCb8G49R91A9QGo+MQWBRQ/Ab/rNnIz9/\n4KP+2fG9iorjlRBg1OYlb4pBomylVpzuiv3T0kNS1KYrtpVK505/MnKLdVUBohgc\no0WuvTMIOwKBgBn5TgeeGHIVY6OQjVtOr0IduWwfGvz9U1o/iAHfo1rgO3zzQ2Rw\njB0MAKFpY0eQHFFUwz5n1bBN/BE0twOhii75aFuyVegTKDorJlW8pEd0JS8Req4b\n7pBUQd8HHLobAhyacSO/QA/HX/xdwZgDYp39O1/EnblQeLqa95SUmiNBAoGAfveX\nLfr95p1KLZOsdEts4GsObZ2p7ieZvk1Do/QDyY/YB9wzHXp1qN1xMIWj+UvjjoBN\n9NuGjcE5CW/FILlIvDl0TZySXbct2AOPR0UYxvMXZjJxpI2H77AEP5AyZ55bF3O/\nuebBcojQGLpccHPR+0c7j8rc3ixnDmDqc/v1khkCgYEAj4WDn1603Lq2L6+IGnjj\nNrxDKa8gnnj668GFJya4iF8+YYDRxHm/JnM9dmZK6WKE67VvlF5P2aXlPhr4KYuw\nhDJc17PUZGS04Nn2rxGgObf2E0lQ0G326e3AK8qpVNTF7FWWMJmJY9jH4qttMXOJ\nMVtnuLk2aeVkWhuZM1njh5E=\n-----END PRIVATE KEY-----\n",



  clientEmail = "dialogflow-nxgkrs@mandilassite.iam.gserviceaccount.com"

let config = {
  credentials: {
    private_key: privateKey,
    client_email: clientEmail
  }
}






const express = require('express')
const bodyParser = require('body-parser')


var app = require('express')();
var http = require('http').Server(app);

var admin = require("firebase-admin");

var stream = require('stream');

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'mandilas',
  api_key: '532299686113429',
  api_secret: 'eSuU7-Y7t1OcRsguSQ4FALVp22I'
});


var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mandilassite.firebaseio.com/",
  storageBucket: "mandilassite.appspot.com"
});

var bucket = admin.storage().bucket();

app.use(bodyParser.json({
  limit: '1mb'
}));
app.use(bodyParser.urlencoded({
  limit: '1mb',
  extended: true
}));





const uuidv1 = require('uuid/v1');

app.use(express.static('public'));


var path = require("path");
//
//
//
const projectId = 'mandilassite'
const sessionId = uuidv1()

const languageCode = 'en'

// Imports the Dialogflow library
const dialogflow = require('dialogflow');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient(config);

// app.get("/admin", (req, res) => {
//
//   res.sendFile(__dirname + "/public/admin/index.html")
// })



app.post("/serviceList", (req, res) => {
  // Get a database reference to our posts
  console.log("Retrieving list");
  var db = admin.database();
  var ref = db.ref("tracking");

  // Attach an asynchronous callback to read the data at our posts reference
  ref.once("value", function(snapshot) {
    res.status(200).send({
      serviceListObject: snapshot.val()
    });
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  })
})


app.post("/usersList", (req, res) => {
  // Get a database reference to our posts
  console.log("Retrieving list");
  var db = admin.database();
  var ref = db.ref("users");

  // Attach an asynchronous callback to read the data at our posts reference
  ref.once("value", function(snapshot) {
    console.log(snapshot);
    res.status(200).send({
      serviceListObject: snapshot.val(),
      userListSnapshot : snapshot
    });
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  })
})

app.post("/admin", (req, res) => {
  var emailTest = /[a-zA-Z0-9]+@?[._]?[a-zA-Z0-9]+@[a-zA-Z0-9]+[._]?[a-zA-Z0-9]+?[._][a-zA-Z0-9]+?/


  var details = req.body.message
  var response = ""


  if (details.uploadData != "" && details.uploadData != null) {
    cloudinary.uploader.upload(details.uploadData, function(error, result) {

      if (details.customerName == "" || details.customerName == null) {
        console.log("here1");
        res.status(200).send({
          requestResponse: "Customer name cannot be left empty"
        })
      } else if (details.customerEmail == "" || details.customerEmail == null) {
        console.log("here2");
        res.status(200).send({
          requestResponse: "Customer email address cannot be left empty"
        })
      } else if (!emailTest.test(details.customerEmail)) {
        console.log("here3");
        res.status(200).send({
          requestResponse: "Invalid email address"
        })
      } else if (details.customerPhone == "" || details.customerPhone == null) {
        console.log("here4");
        res.status(200).send({
          requestResponse: "Customer phone number cannot be left empty"
        })
      } else if (details.vehicleReg == "" || details.vehicleReg == null) {
        console.log("here5");
        res.status(200).send({
          requestResponse: "Enter vehicle registration number"
        })
      } else if (details.vehicleBrand == "" || details.vehicleBrand == null) {
        console.log("here6");
        res.status(200).send({
          requestResponse: "Enter vehicle brand"
        })
      } else if (details.dropOffDate == "" || details.dropOffDate == null) {
        console.log("here7");
        res.status(200).send({
          requestResponse: "Select a drop-off date"
        })
      } else if (details.pickUpDate == "" || details.pickUpDate == null) {
        console.log("here8");
        res.status(200).send({
          requestResponse: "Select a pick-up date"
        })
      } else if (details.employeeInCharge == "" || details.employeeInCharge == null) {
        console.log("here9");
        res.status(200).send({
          requestResponse: "Provide the name of the employee in charge of this issue"
        })
      } else if (details.vehicleModel == "" || details.vehicleModel == null) {
        console.log("here10");
        res.status(200).send({
          requestResponse: "Enter vehicle model"
        })
      } else {
        console.log("pushing");
        var db = admin.database();
        var ref = db.ref("/tracking").push()
        var trackingCode = ref.key

        ref.set(details, function(error) {
          if (error) {

          } else {
            ref.update({
              trackingCode: trackingCode,
              carImage : result.url
            }, function(error) {
              if (error) {

              } else {
                res.status(200).send({
                  requestResponse: "Ok",
                  trackingCode: trackingCode
                })
              }
            })

          }
        })

      }

    });


  } else if (details.customerName == "" || details.customerName == null) {
    console.log("here1");
    res.status(200).send({
      requestResponse: "Customer name cannot be left empty"
    })
  } else if (details.customerEmail == "" || details.customerEmail == null) {
    console.log("here2");
    res.status(200).send({
      requestResponse: "Customer email address cannot be left empty"
    })
  } else if (!emailTest.test(details.customerEmail)) {
    console.log("here3");
    res.status(200).send({
      requestResponse: "Invalid email address"
    })
  } else if (details.customerPhone == "" || details.customerPhone == null) {
    console.log("here4");
    res.status(200).send({
      requestResponse: "Customer phone number cannot be left empty"
    })
  } else if (details.vehicleReg == "" || details.vehicleReg == null) {
    console.log("here5");
    res.status(200).send({
      requestResponse: "Enter vehicle registration number"
    })
  } else if (details.vehicleBrand == "" || details.vehicleBrand == null) {
    console.log("here6");
    res.status(200).send({
      requestResponse: "Enter vehicle brand"
    })
  } else if (details.dropOffDate == "" || details.dropOffDate == null) {
    console.log("here7");
    res.status(200).send({
      requestResponse: "Select a drop-off date"
    })
  } else if (details.pickUpDate == "" || details.pickUpDate == null) {
    console.log("here8");
    res.status(200).send({
      requestResponse: "Select a pick-up date"
    })
  } else if (details.employeeInCharge == "" || details.employeeInCharge == null) {
    console.log("here9");
    res.status(200).send({
      requestResponse: "Provide the name of the employee in charge of this issue"
    })
  } else if (details.vehicleModel == "" || details.vehicleModel == null) {
    console.log("here10");
    res.status(200).send({
      requestResponse: "Enter vehicle model"
    })
  } else {
    console.log("pushing");
    var db = admin.database();
    var ref = db.ref("/tracking").push()
    var trackingCode = ref.key

    ref.set(details, function(error) {
      if (error) {

      } else {
        ref.update({
          trackingCode: trackingCode
        }, function(error) {
          if (error) {

          } else {
            res.status(200).send({
              requestResponse: "Ok",
              trackingCode: trackingCode
            })
          }
        })

      }
    })

  }

})


app.post("/productList",(req,res) => {
  console.log("Retrieving list");
  var db = admin.database();
  var ref = db.ref("products");

  // Attach an asynchronous callback to read the data at our posts reference
  ref.once("value", function(snapshot) {
    console.log(snapshot.val());
    res.status(200).send({
      serviceListObject: snapshot.val(),
      // userListSnapshot : snapshot
    });
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  })
})

app.post('/', (req, res) => {


  const queries = [req.body.message]

  console.log(req.body.message);


  async function detectIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languageCode
  ) {
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };

    if (contexts && contexts.length > 0) {
      request.queryParams = {
        contexts: contexts,
      };
    }

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
  }

  async function executeQueries(projectId, sessionId, queries, languageCode) {
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    let context;
    let intentResponse;
    for (const query of queries) {
      try {
        console.log(`Sending Query: ${query}`);
        intentResponse = await detectIntent(
          projectId,
          sessionId,
          query,
          context,
          languageCode
        );
        console.log('Detected intent');
        console.log(
          `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`

        );

        res.status(200).send({
          cityID: intentResponse.queryResult.fulfillmentText
        });

        // socket.emit('messageResponse', {
        //   description: intentResponse.queryResult.fulfillmentText
        // });

        // Use the context from this response for next queries
        context = intentResponse.queryResult.outputContexts;
      } catch (error) {
        console.log(error);
      }
    }
  }
  executeQueries(projectId, sessionId, queries, languageCode);
})




app.post("/accountProfile", (req, res) => {
  console.log(req.body.trackingID);
  var db = admin.database();
  var ref = db.ref("tracking/" + req.body.trackingID);



  ref.once("value", function(snapshot) {

    if(snapshot.val()!=null){
      res.status(200).send({
        serviceListObject: snapshot
      })
    }else{
      res.status(200).send({
        serviceListObject: "error"
      })
    }
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
})


app.post("/admin/createnewproduct", (req,res) => {
  const details = req.body.productDetails

  console.log(req.body.productImage);



  if(req.body.productImage == "" || req.body.productImage == null){
    res.status(200).send({
      createResponse : "Select a product image"
    })
  }else{

    if(details.name == ""){
      res.status(200).send({
        createResponse : "Enter product Name"
      })
    }else if(details.actualPrice == ""){
      res.status(200).send({
        createResponse : "Enter product Price"
      })
    }else if (details.capacity == ""){
      res.status(200).send({
        createResponse : "Enter product capacity"
      })
    }else if (details.text == ""){
      res.status(200).send({
        createResponse : "Enter product description"
      })
    }else if (details.size == ""){
      res.status(200).send({
        createResponse : "Enter product size"
      })
    }else if (details.usage == ""){
      res.status(200).send({
        createResponse : "Enter product usage"
      })
    } else{
      var db = admin.database();
      var productId = uuidv1()
      var ref = db.ref("/products/" + productId)


      ref.set(details, function(error) {
        if (error) {

        } else {
          ref.update({
            productID: productId
          }, function(error) {
            if (error) {

            } else {
              cloudinary.uploader.upload(req.body.productImage, function(error, result){
                console.log(result);
                ref.update({
                  cloudinaryImageID: result.public_id,
                  imageUrl : result.url
                }, function(error) {
                  if (error) {

                  } else {
                    res.status(200).send({
                      createResponse: "Ok"
                    })
                  }
                })

              })
            }
          })

        }
      })






    }


  }




})



app.post("/updateJobs", (req, res) => {
  console.log(req.body.jobStatusDetails);
  var db = admin.database();

  console.log(req.body.jobStatusDetails.recordID, req.body.jobStatusDetails.jobKey);
  var ref = db.ref("/tracking/" + req.body.jobStatusDetails.recordID + "/maintenanceWorks/" + req.body.jobStatusDetails.jobKey)


  ref.update({
    status: req.body.jobStatusDetails.newStatus
  }, function(error) {
    if (error) {

    } else {

      var ref = db.ref("/tracking/" + req.body.jobStatusDetails.recordID + "/maintenanceWorks/");

      ref.once("value", function(snapshot) {
        console.log(snapshot.val());



        var result = Object.keys(snapshot.val()).map(function(key) {

          // Using Number() to convert key to number type
          // Using obj[key] to retrieve key value
          return [Number(key), snapshot.val()[key]];
        });



        let statuses = []

        for (var i = 0; i < result.length; i++) {
          statuses.push(result[i][1].status)
        }

        if(!statuses.includes("Pending") && !statuses.includes("In Progress")){
          var statusRef = db.ref("/tracking/" + req.body.jobStatusDetails.recordID)
          statusRef.update({status : "Completed"}, function(error) {
            if (error) {

            } else {

            }
          })
        }

        console.log(statuses);


      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });









      res.status(200).send({
        newStatus: req.body.jobStatusDetails.newStatus
      })

    }
  })
})



app.post("/setInProgress",(req,res) => {
  var db = admin.database();
  var statusRef = db.ref("/tracking/" + req.body.setInProgressDetails.jobKey)
  statusRef.update({status : "In Progress"}, function(error) {
    if (error) {

    } else {
      res.status(200).send({
        resp : "OK"
      });
    }
  })
})


app.post("/checkCurrentStatus",(req,res) => {
  console.log(req.body.currentRecordTrackingCode);
  var db = admin.database();
  var ref = db.ref("tracking/" + req.body.currentRecordTrackingCode + "/status");

  ref.once("value", function(snapshot) {


    res.status(200).send({
      status : snapshot.val()
    });
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
})


app.post("/saveUserDetails",(req,res) => {
  console.log(req.body.userDetails);
  let allUserDetails = {}

  const firstName = req.body.userDetails.firstName
  const lastName = req.body.userDetails.lastName
  const userEmailAddress = req.body.userDetails.email
  const phoneNumber = req.body.userDetails.phoneNumber
  const address = req.body.userDetails.address
  const location = req.body.userDetails.location
  const userID = req.body.userDetails.userID

  if(firstName != "" && firstName != null){
    allUserDetails.firstName = firstName
  }

  if(lastName != "" && lastName != null){
    allUserDetails.lastName = lastName
  }

  if(userEmailAddress != "" && userEmailAddress != null){
    allUserDetails.userEmailAddress = userEmailAddress
  }

  if(phoneNumber != "" && phoneNumber != null){
    allUserDetails.phoneNumber = phoneNumber
  }

  if(address != "" && address != null){
    allUserDetails.address = address
  }

  if(location != "" && address != null){
    allUserDetails.location = location
  }

  if(userID != "" && userID != null){
    allUserDetails.userID = userID
  }

  var db = admin.database();
  var ref = db.ref("/users/" + userID)


  ref.update(allUserDetails, function(error) {
    if (error) {
      res.status(200).send({
        requestResponse: "Error"
      })
    } else {
      res.status(200).send({
        requestResponse: "Ok"
      })

    }
  })


})


app.post("/deleteUser",(req,res) => {
  admin.auth().deleteUser(req.body.userID)
  .then(function() {
    var db = admin.database();
    var ref = db.ref("/users/" + req.body.userID)


    ref.set(null, function(error) {
      if(error){
        res.status(200).send({
          requestResponse: "Error"
        })
      }else{
        res.status(200).send({
          requestResponse: "Ok"
        })
        console.log('Successfully deleted user');
      }
    })

  })
  .catch(function(error) {
    res.status(200).send({
      requestResponse: "Error"
    })
    console.log('Error deleting user:', error);
  });
})

//Whenever someone connects this gets executed


app.get("/", (req, res) => {
  app.use(express.static('public/homepage'));
  res.sendFile(__dirname + "/public/homepage/index.html")
})




http.listen(8085, function() {
  console.log('listening on *:3000');
});
