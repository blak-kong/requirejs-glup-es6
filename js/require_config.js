'use strict';
var require = {
    
    paths: {
        "jquery": './lib/jquery.min',
        'entry': './entry',
        'math': './math',
        'demo': './demo'
    }
};

if(typeof module === "object" && typeof module.exports === 'object') {
    module.exports = require;
}