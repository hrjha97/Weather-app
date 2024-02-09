const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static( "public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const query = req.body.city;
    const apiKey = process.env.API_KEY; // Accessing the API key from environment variables

    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data); 
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            
            res.write(`<p>The weather is ${description} <p>`);
            res.write(`<h1> The temperature in ${query} is ${temp} degree Celsius </h1>`);
            res.write(`<img src="${imageUrl}">`);
            res.send();
        });
    });
});

app.listen(3000, function(){
    console.log("App is running");
});
