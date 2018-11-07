import mongoose = require('mongoose');

export interface ISite extends mongoose.Document {
    url: string; 
    title: string; 
    links: string[];
    words: string[];
    depth: number;
}
  
export const SiteSchema = new mongoose.Schema({
    url: {
        type: String
    },
    title: {
        type: String
    },
    links: [
        {
            type: String
        }
    ],
    words:[
        {
            type: String
        }
    ],
    depth: {
        type: Number
    }
});
  
const Site = mongoose.model<ISite>('Site', SiteSchema);
export default Site;