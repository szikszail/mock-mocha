'use strict';

const Hook = require('./Hook');

class AfterEach extends Hook {
    static setupAPI(api) {
        api.AfterEach = AfterEach;
        api.afterEach = (description, hook) => {
            if (hook === undefined && typeof description === "function") {
                hook = description;
                description = '';
            }
            api.hooks.push(new AfterEach(api.STATUS.OK, description, hook));
        };
    }
}

module.exports = AfterEach;