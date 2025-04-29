const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors')
const dotenv = require('dotenv')


// Load env vars
dotenv.config({path: './config/config.env'});

//Load Models
const Dev = require('./models/dev.model');
const Course = require('./models/course.model');
const User = require("./models/user.model");


//Connect DB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

//Read JSON
const dev = JSON.parse(fs.readFileSync(`${__dirname}/_data/dev.json`, 'utf-8'));
const course = JSON.parse(fs.readFileSync(`${__dirname}/_data/course.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8'));



// Import into DB
const importData = async() => {
    try {        
        await Dev.create(dev);
        await Course.create(course);
        await User.create(users);
        console.log("Data imported...".green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

//Delete data
const deleteData = async() => {
    try {
        await Dev.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log("Data deleted...".red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}