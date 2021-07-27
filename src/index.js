const express = require('express');
const app = express();

const server = require('http').createServer(app);
const socketIO = require('socket.io')(server, { "cors": { "origin": "*" } });

const scheduler = require('node-schedule');

const port = process.env.port || 8000;

const hbs = require("hbs");

app.set("view engine", "hbs");

let periodicFunction = function () {
    let newDate = new Date(Date.now());
    const data = newDate.toDateString() + " : " + newDate.toTimeString();
    return data;
};


app.get("/", (req, res) => {
    res.render("index");
});


socketIO.on('connection', (socket) => {
    console.log("Client connected and it's id is : " + socket.id);


    scheduler.scheduleJob('*/2 * * * * *', () => {

        let newDate = new Date(Date.now());
        const data = newDate.toDateString() + " : " + newDate.toTimeString();
        // const person = { name: "Vikas Kumar", age: 34, sex: "male", developer : "Node Js" };
        socket.emit("message", data);
    });


});

server.listen(port, (req, res) => {
    console.log(`listning on port : ${port}`);
});

