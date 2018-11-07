import { SearchController } from '../controllers/search.controller';
import * as express from 'express';

export class SearchRoutes{

    public searchController: SearchController = new SearchController();

    public configureRoutes(app : express.Application){
        app.route('/indexSite')
            .post(this.searchController.indexSite);
        app.route('/indexSite')
            .delete(this.searchController.clearIndex);
        app.route('/indexSite/:word')
            .get(this.searchController.findWord);
    }
}
