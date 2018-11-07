"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const mongoDbConnection_1 = __importDefault(require("./config/mongoDbConnection"));
const cors = __importStar(require("cors"));
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const search_route_1 = require("./routes/search.route");
const app = express.default();
const port = process.env.PORT || 3003;
mongoose.connect(mongoDbConnection_1.default.database);
app.use(cors.default());
app.set('secreterPassword', mongoDbConnection_1.default.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
const searchRoutes = new search_route_1.SearchRoutes();
searchRoutes.configureRoutes(app);
app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
