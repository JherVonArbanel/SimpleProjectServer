import mongoose = require('mongoose');
import { SiteSchema, ISite } from '../model/sites';
import { Request, Response } from 'express';
import {SearchEngine} from './searchEngine';
import { SearchResultDTO } from '../model/searchResultDTO';

const Site = mongoose.model<ISite>('Site', SiteSchema);

export class SearchController{

    public indexSite (req: Request, res: Response) {                
        let url: string = req.body.url;
        let searchEngine = new SearchEngine();
        searchEngine.IndexUrl(url)
            .then(results=>{
                results.forEach(x=>{
                    let newSite = new Site({
                        url : x.url,
                        title : x.title,
                        links : x.links,
                        words : x.words,
                        depth : x.depth
                    });
                    
                    newSite.save()
                        .then(()=>{
                            console.log('done');
                        });
                });
                res.send({data:results});
            });
    }

    public clearIndex (req: Request, res: Response) {
        var conditions:any = {}; 
        Site.remove(conditions)
            .then(()=>{
                console.log('done');
                res.send({data:{success:true}});
            });
    }

    public findWord (req: Request, res: Response) {
        let filterWord: string = req.params.word;
        Site.find({words:filterWord})
            .then((documents) => {
                let result:SearchResultDTO[] = [];
                let resultIds = documents.map(x=>x._id);
                documents.forEach(x=>{
                    let tmpItem = new SearchResultDTO();
                    tmpItem.title = x.title;
                    tmpItem.wordCount = x.words.filter(y=>y == filterWord).length,
                    tmpItem.url = x.url;
                    result.push(tmpItem);
                });
                result = result.sort((a,b)=>{
                    return b.wordCount-a.wordCount;
                });
                Site.find({ _id: { $nin: resultIds } })
                    .then(notResults=>{
                        notResults.forEach(x=>{
                            let tmpNewItem = new SearchResultDTO();
                            tmpNewItem.title = x.title,
                            tmpNewItem.url = x.url,
                            tmpNewItem.wordCount = x.words.filter(y=>y == filterWord).length,
                            result.push(tmpNewItem);
                        });
                        res.send({data:result});
                    });
            });
    }
}

