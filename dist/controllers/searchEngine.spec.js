"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const searchEngine_1 = require("./searchEngine");
const chai_1 = require("chai");
require("mocha");
describe('Get hrefs from text', () => {
    it('should download content', () => {
        const engine = new searchEngine_1.SearchEngine();
        return engine.DownloadFile('https://www.google.com')
            .then(content => {
            chai_1.expect(content.length).greaterThan(0);
        });
    });
    it('should return list href', () => {
        const engine = new searchEngine_1.SearchEngine();
        let result = engine.GetLinks(`asdfasdf<xxx> yyy  <a href="wwww.google22.com">
     pppp <xxx>zzzzz<xxx/><xxx/> yyy <xxx/>dfasdfasd<a href='wwww.google33.com'><a href="wwww.google2.com">`);
        chai_1.expect(result.length).to.equal(3);
    });
    it('should return list of words', () => {
        const engine = new searchEngine_1.SearchEngine();
        let result = engine.GetWords(`asdfasdf<xxx> yyy  <a href="wwww.google22.com">
     pppp <xxx>zzzzz<xxx/><xxx/> yyy <xxx/>dfasdfasd<a href='wwww.google33.com'><a href="wwww.google2.com">`);
        chai_1.expect(result.length).to.equals(6);
    });
    it('should return title from content', () => {
        const engine = new searchEngine_1.SearchEngine();
        let result = engine.GetTitle('<head>dafdafdaf<title>asdfasdfa<title/><head/><body>adsfasd<body>');
        chai_1.expect(result).to.equals('asdfasdfa');
    });
    it('should return 3 levels of index for a site', () => {
        const engine = new searchEngine_1.SearchEngine();
        let indexed = engine.IndexUrl('https://www.google.com');
        chai_1.expect(indexed).greaterThan(0);
    });
});
