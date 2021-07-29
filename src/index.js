const express = require('express');
const app = express();

const server = require('http').createServer(app);
const socketIO = require('socket.io')(server, { "cors": { "origin": "*" } });

const scheduler = require('node-schedule');
const mongoose = require('mongoose');


//Constants
const local_host_port = process.env.port || 8000;
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
const localhost_db_uri = 'mongodb://localhost:27017/algoTrading';
const server_db_uri = process.env.MONGODB_URI;


//Setup View Engine
app.set("view engine", "hbs");


//Routing
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/addinfo", (req, res) => {
    res.render("addinfo");
});

app.get("/showinfo", (req, res) => {
    res.render("showinfo");

});


socketIO.on('connection', (socket) => {
    console.log("Client connected and it's id is : " + socket.id);
    socketRef = socket;

    socket.on("addinfo", (infoData) => {

        addInfoToDB(infoData)
        console.log(infoData);
    });

    scheduler.scheduleJob('*/2 * * * * *', () => {

        let newDate = new Date(Date.now());
        const data = newDate.toDateString() + " : " + newDate.toTimeString();
        // const person = { name: "Vikas Kumar", age: 34, sex: "male", developer : "Node Js" };
        socket.emit("message", data);
    });

    scheduler.scheduleJob('*/1 * * * * *', () => {
        fetchAllInfo((result) => {
            socket.emit("showinfo", JSON.stringify(result));
        })
    });

});


//DB Connection
mongoose.connect(server_db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("Database created or connected successfully")
}).catch((error) => {
    console.log(error);
})

//Creating schema for addInfo
//Creating document

const addInfoSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    sex: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

//Creating Model for addInfo
//Creating collections 
const AddInfo = new mongoose.model("AddInfo", addInfoSchema);


//function to add info into db
const addInfoToDB = async (infoData) => {
    try {
        const reactAddInfo = new AddInfo({
            firstName: infoData.firstName,
            lastName: infoData.lastName,
            age: infoData.age,
            sex: infoData.sex
        });

        const result = await reactAddInfo.save();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

//function to fetch all data from db
const fetchAllInfo = async (callback) => {

    try {
        const result = await AddInfo.find({});
        return callback(result);
    } catch (error) {
        console.log(error);
    }

}

//Hosting Server
server.listen(server_port, server_host, (req, res) => {
    console.log(`listning on server_port : ${server_port} and server_host ${server_host}`);
});

//Local Host
// server.listen(local_host_port, (req, res) => {
//     console.log(`listning on port : ${local_host_port}`);
// });


