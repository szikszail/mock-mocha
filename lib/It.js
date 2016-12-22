'use strict';

const Test = require('./Test');

class It extends Test {
    static setupAPI(api) {
        api.It = It;
        api.it = (description, test) => {
            api.its.push(new It(description, test));
        };
        api.it.only = (description, test) => {
            api.its.push(new It(description, test, Test.STATUS.ONLY));
        };
        api.it.skip = (description, test) => {
            api.its.push(new It(description, test, Test.STATUS.SKIP));
        };
    }
}

module.exports = It;