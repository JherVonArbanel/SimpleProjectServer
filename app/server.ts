import * as express from 'express';
import mongoConfig from './config/mongoDbConnection';
import * as cors from 'cors';
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import {SearchRoutes} from './routes/search.route';

const app: express.Application = express.default();
const port = process.env.PORT || 3003;

mongoose.connect(mongoConfig.database);
app.use(cors.default());
app.set('secreterPassword',mongoConfig.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');     
    next();
});

const searchRoutes = new SearchRoutes();
searchRoutes.configureRoutes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);



