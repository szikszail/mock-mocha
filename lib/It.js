'use strict';

const Test = require('./Test');

class It extends Test {
    static setupAPI(api) {
        api.It = It;
        api.it = (description, test) => {
            api.its.push(new It(api.STATUS.OK, description, test));
        };
        api.it.only = (description, test) => {
            api.its.push(new It(api.STATUS.ONLY, description, test));
        };
        api.it.skip = (description, test) => {
            api.its.push(new It(api.STATUS.SKIP, description, test));
        };
    }
}

module.exports = It;