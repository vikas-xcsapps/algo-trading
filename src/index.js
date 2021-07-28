const express = require('express');
const app = express();

const server_https = require('https').createServer(app);
const server = require('http').createServer(app);
const socketIO = require('socket.io')(server, { "cors": { "origin": "*" } });

const scheduler = require('node-schedule');

const port = process.env.port || 8000;
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.set("view engine", "hbs");


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/vinod",(req,res) => {
res.send("I am vinod");
})


socketIO.on('connection', (socket) => {
    console.log("Client connected and it's id is : " + socket.id);


    scheduler.scheduleJob('*/2 * * * * *', () => {

        let newDate = new Date(Date.now());
        const data = newDate.toDateString() + " : " + newDate.toTimeString();
        // const person = { name: "Vikas Kumar", age: 34, sex: "male", developer : "Node Js" };
        socket.emit("message", data);
    });


});


server.listen(server_port, server_host, (req, res) => {
    console.log(`listning on port : ${port}`);
});


