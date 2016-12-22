'use strict';

const Hook = require('./Hook');

class BeforeEach extends Hook {
    static setupAPI(api) {
        api.BeforeEach = BeforeEach;
        api.beforeEach = (description, hook) => {
            if (hook === undefined && typeof description === "function") {
                hook = description;
                description = '';
            }
            api.hooks.push(new BeforeEach(api.STATUS.OK, description, hook));
        };
    }
}

module.exports = BeforeEach;