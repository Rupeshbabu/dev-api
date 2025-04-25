const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors')
const dotenv = require('dotenv')


// Load env vars
dotenv.config({path: './config/config.env'});

//Load Models
const Dev = require('./models/dev.model');

//Connect DB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

//Read JSON
const dev = JSON.parse(fs.readFileSync(`${__dirname}/_data/dev.json`, 'utf-8'));

// Import into DB
const importData = async() => {
    try {        
        await Dev.create(dev);
        console.log("Data imported...".green.bold.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

//Delete data
const deleteData = async() => {
    try {
        await Dev.deleteMany();
        console.log("Data deleted...".red.bold.inverse);
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