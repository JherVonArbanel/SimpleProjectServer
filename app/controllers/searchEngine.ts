import https from 'https';
import { rejects } from 'assert';
import { IndexDTO } from '../model/indexDTO';

export class SearchEngine{

    private depth : number = 0;

    public GetLinks(content:string) : string[] {
        let links = content.match(/(href=["']{1})[\w.\\-_\/:]*["']{1}/g);
        links = links || []; 
        return links.map(x=>{
            return x.substring(0,x.length-1)
                .replace('href="','')
                .replace('href=\'','');
        });
    }

    public GetWords(content:string):string[]{
        let result: string[] = [];
        const wordSeparators = ',<> :.(){}=;\|/\\';
        let word: string = '';
        let skipTag: boolean = false;
        for(let idx=0;idx < content.length;idx++){
            let chr = content[idx];
            if(wordSeparators.indexOf(chr) == -1){
                if(!skipTag){
                    if(chr.match(/^[A-Za-z]+$/)){
                        word += chr;
                    }
                    else{
                        if (word != '') {
                            result.push(word);
                            word = '';
                        }
                    }
                }
            }
            else{
                if(chr === '<'){
                    skipTag = true;
                    if(word != ''){
                        result.push(word);
                        word = '';
                    }
                }
                else if(chr == '>'){
                    skipTag = false;
                }
                else if(word != '' && word !='\n'){
                    result.push(word);
                    word = '';
                }
            }
        }
        return result;
    }

    public GetTitle(content:string):string{
        let result = '';
        let tmpMatch = content.match('<title>');
        let tmpIndex = 0;
        if(tmpMatch != null){
            tmpIndex = tmpMatch.index == undefined? 0 : tmpMatch.index;
            content = content.substring(tmpIndex);
        }
        tmpMatch = content.match('</title>');
        if(tmpMatch != null){
            tmpIndex = tmpMatch.index == undefined? 0 : tmpMatch.index;
        }
        return content.substring(7, tmpIndex).trim();
    }

    public DownloadFile(url:string):Promise<string>{
        return new Promise<string>((resolve, reject) => { 
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data); 
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
        
    }

    private IndexOneUrl(url:string,depth:number):Promise<IndexDTO>{
        let result:IndexDTO = new IndexDTO();
        return this.DownloadFile(url)
            .then(content=>{
                result.words = this.GetWords(content);
                result.links = this.GetLinks(content);
                for(let idx= 0;idx< result.links.length;idx++){
                    if(result.links[idx].startsWith('/')){
                        result.links[idx] = url + result.links[idx];
                    }
                }
                result.links = result.links.filter(x=>x!= url && x!= '');
                result.title = this.GetTitle(content);
                result.url = url;
                result.depth = depth;
                return result;
            })
            .catch(err=>{
                return result;
            });
    }

    public IndexUrl(url:string):Promise<IndexDTO[]>{
        let results:IndexDTO[] = [];
        return this.IndexOneUrl(url,0)
            .then(result=>{
                results.push(result);
                var secondLevelPromises = result.links.map(x=> {return this.IndexOneUrl(x,1);});
                return Promise.all(secondLevelPromises)
                    .then(secondLevelResult=>{
                        let thirdLevelPromises:Promise<IndexDTO>[] = [];
                        secondLevelResult.forEach(item=>{
                            results.push(item);
                            thirdLevelPromises = item.links.map(x=> {return this.IndexOneUrl(x,2);});
                        });
                        return Promise.all(thirdLevelPromises)
                            .then(thirdLevelResult=>{
                                thirdLevelResult.forEach(item=>{
                                    results.push(item);
                                });
                                return results;
                            });
                    });
            });
    }
}