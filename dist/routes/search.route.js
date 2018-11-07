"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_controller_1 = require("../controllers/search.controller");
class SearchRoutes {
    constructor() {
        this.searchController = new search_controller_1.SearchController();
    }
    configureRoutes(app) {
        app.route('/indexSite')
            .post(this.searchController.indexSite);
        app.route('/indexSite')
            .delete(this.searchController.clearIndex);
        app.route('/indexSite/:word')
            .get(this.searchController.findWord);
    }
}
exports.SearchRoutes = SearchRoutes;
