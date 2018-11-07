"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const sites_1 = require("../model/sites");
const searchEngine_1 = require("./searchEngine");
const searchResultDTO_1 = require("../model/searchResultDTO");
const Site = mongoose.model('Site', sites_1.SiteSchema);
class SearchController {
    indexSite(req, res) {
        let url = req.body.url;
        let searchEngine = new searchEngine_1.SearchEngine();
        searchEngine.IndexUrl(url)
            .then(results => {
            results.forEach(x => {
                let newSite = new Site({
                    url: x.url,
                    title: x.title,
                    links: x.links,
                    words: x.words,
                    depth: x.depth
                });
                newSite.save()
                    .then(() => {
                    console.log('done');
                });
            });
            res.send({ data: results });
        });
    }
    clearIndex(req, res) {
        var conditions = {};
        Site.remove(conditions)
            .then(() => {
            console.log('done');
            res.send({ data: { success: true } });
        });
    }
    findWord(req, res) {
        let filterWord = req.params.word;
        Site.find({ words: filterWord })
            .then((documents) => {
            let result = [];
            let resultIds = documents.map(x => x._id);
            documents.forEach(x => {
                let tmpItem = new searchResultDTO_1.SearchResultDTO();
                tmpItem.title = x.title;
                tmpItem.wordCount = x.words.filter(y => y == filterWord).length,
                    tmpItem.url = x.url;
                result.push(tmpItem);
            });
            result = result.sort((a, b) => {
                return b.wordCount - a.wordCount;
            });
            Site.find({ _id: { $nin: resultIds } })
                .then(notResults => {
                notResults.forEach(x => {
                    let tmpNewItem = new searchResultDTO_1.SearchResultDTO();
                    tmpNewItem.title = x.title,
                        tmpNewItem.url = x.url,
                        tmpNewItem.wordCount = x.words.filter(y => y == filterWord).length,
                        result.push(tmpNewItem);
                });
                res.send({ data: result });
            });
        });
    }
}
exports.SearchController = SearchController;
