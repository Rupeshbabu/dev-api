const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errors');
// Load env vars
dotenv.config({path:'./config/config.env'});

const devRoutes = require('./routes/dev.route');
const courseRoute = require('./routes/course.route');
// const logger = require('./middleware/logger.middleware');
const morgan = require('morgan'); //3rd party middleware

//Connect to DB
connectDB();


const app = express();

// app.use(logger);

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Body parser
app.use(express.json());

app.use('/api/v1/dev', devRoutes);
app.use('/api/v1/coursea', courseRoute);

// we need to decalre after routing paths
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold); 
});

//Handle unhandle promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    //close server & exit process
    server.close(() => process.exit(1));
});

app.get('/', (req, res) => {
    res.send("<h1>Hello from express</h1>")
})