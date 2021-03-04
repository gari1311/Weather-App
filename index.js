require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.current.temperature);
  temperature = temperature.replace("{%pres%}", orgVal.current.pressure);
  temperature = temperature.replace("{%humi%}", orgVal.current.humidity);
  temperature = temperature.replace("{%name%}", orgVal.location.name);
  temperature = temperature.replace("{%country%}", orgVal.location.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.current.weather_descriptions[0]);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.weatherstack.com/current?access_key=9ca2ab312abf4bea3acc9801be907075&query=Mumbai"
    )
    .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        //console.log(arrData[0].current.weather_descriptions[0])
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
