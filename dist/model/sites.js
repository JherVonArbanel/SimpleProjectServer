"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.SiteSchema = new mongoose.Schema({
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
    words: [
        {
            type: String
        }
    ],
    depth: {
        type: Number
    }
});
const Site = mongoose.model('Site', exports.SiteSchema);
exports.default = Site;
