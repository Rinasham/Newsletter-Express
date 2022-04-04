const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
require('dotenv').config();


const app = express()


const key = process.env.API_KEY_FOR_NEWSLETTER


app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/signUp.html')
})


app.post('/', function(req, res){
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email
  
  const data = {
    members: [
      {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
      }
    ]
  }

  const jsonData = JSON.stringify(data)

  const url = `https://us14.api.mailchimp.com/3.0/lists/7723c40f46`
  const options = {
    method: 'POST',
    auth: `rina:${key}`
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + '/success.html')
    } else {
      res.sendFile(__dirname + '/failure.html')
    }

    // response.on('data', function(data){
    //   console.log(JSON.parse(data));
    // })

    request.on('error', error => {
      console.log(error)
    })

  })

  request.write(jsonData)
  request.end()
})


app.post('/failure', (req,res)=>{
  res.redirect('/')
})





app.listen(3000, function(){
  console.log('server is running on port 3000');
})