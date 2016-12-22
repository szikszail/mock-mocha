'use strict';

const Hook = require('./Hook');

class Before extends Hook {
    static setupAPI(api) {
        api.Before = Before;
        api.before = (description, hook) => {
            if (hook === undefined && typeof description === "function") {
                hook = description;
                description = '';
            }
            api.hooks.push(new Before(api.STATUS.OK, description, hook));
        };
    }
}

module.exports = Before;