const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errors');
const monogoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// Load env vars
dotenv.config({path:'./config/config.env'});

const devRoutes = require('./routes/dev.route');
const courseRoute = require('./routes/course.route');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const reviewRoute = require('./routes/review.route');
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

//File Upload
app.use(fileUpload());

//Sanitize Data
app.use(monogoSanitize());

// Set Security headers
app.use(helmet());

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Cookie Parser
app.use(cookieParser());

app.use('/api/v1/dev', devRoutes);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/review', reviewRoute);

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
});