'use strict';

const Hook = require('./Hook');

class After extends Hook {
    static setupAPI(api) {
        api.After = After;
        api.after = (description, hook) => {
            if (hook === undefined && typeof description === "function") {
                hook = description;
                description = '';
            }
            api.hooks.push(new After(description, hook));
        };
    }
}

module.exports = After;