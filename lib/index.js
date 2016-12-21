'use strict';

const utils = require('./utils');

const MOCHA_METHODS = ['describe', 'it', 'before', 'beforeEach', 'afterEach', 'after', 'run'];

const API = {};

API.describes = [];
API.its = [];
API.hooks = [];
API.delayed = false;

API.run = () => {
    API.delayed = true;
};

API.clear = () => {
    API.describes = [];
    API.its = [];
    API.hooks = [];
    API.delayed = false;
};

API.STATUS = { OK: 1, ONLY: 2, SKIP: 3 };

class Test {
    constructor(type, description, test) {
        this.type = type;
        this.description = description;
        this.test  = test;
    }

    _getThis() {
        const self = this;
        return {
            skip() {
                self.type = API.STATUS.SKIP;
            }
        };
    }

    execute() {
        if (!this.test) {
            return Promise.reject(`Test of [${this.description}] is not defined!`);
        }
        const that = this._getThis();
        if (utils.hasCallback(this.test)) {
            return new Promise((resolve, reject) => {
                try {
                    this.test.call(that, result => {
                        result ? reject(result) : resolve();
                    });
                } catch(e) {
                    reject(e);
                }
            });
        }
        try {
            let result = this.test.call(that);
            if (result && result.then) {
                return result;
            }
            return Promise.resolve(result);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}

class Describe extends Test {
    execute() {
        const that = this._getThis();
        this.test && this.test.call(that);
    }
}

API.Describe = Describe;
API.describe = (description, test) => {
    API.describes.push(new Describe(API.STATUS.OK, description, test));
};
API.describe.only = (description, test) => {
    API.describes.push(new Describe(API.STATUS.ONLY, description, test));
};
API.describe.skip = (description, test) => {
    API.describes.push(new Describe(API.STATUS.SKIP, description, test));
};
 
class It extends Test {}

API.It = It;
API.it = (description, test) => {
    API.its.push(new It(API.STATUS.OK, description, test));
};
API.it.only = (description, test) => {
    API.its.push(new It(API.STATUS.ONLY, description, test));
};
API.it.skip = (description, test) => {
    API.its.push(new It(API.STATUS.SKIP, description, test));
};

class Hook extends Test {}
API.Hook = Hook;

class Before extends Hook {}
class BeforeEach extends Hook {}
class AfterEach extends Hook {}
class After extends Hook {}

API.Before = Before;
API.before = (description, hook) => {
    if (hook === undefined && typeof description === "function") {
        hook = description;
        description = '';
    }
    API.hooks.push(new Before(API.STATUS.OK, description, hook));
};

API.BeforeEach = BeforeEach;
API.beforeEach = (description, hook) => {
    if (hook === undefined && typeof description === "function") {
        hook = description;
        description = '';
    }
    API.hooks.push(new BeforeEach(API.STATUS.OK, description, hook));
};

API.AfterEach = AfterEach;
API.afterEach = (description, hook) => {
    if (hook === undefined && typeof description === "function") {
        hook = description;
        description = '';
    }
    API.hooks.push(new AfterEach(API.STATUS.OK, description, hook));
};

API.After = After;
API.after = (description, hook) => {
    if (hook === undefined && typeof description === "function") {
        hook = description;
        description = '';
    }
    API.hooks.push(new After(API.STATUS.OK, description, hook));
};

let storedMochaGlobals = {};

API.saveMochaGlobals = globalScope => {
    globalScope = globalScope || global;
    storedMochaGlobals = {};
    return utils.copyMethods(globalScope, storedMochaGlobals, MOCHA_METHODS);
};

API.restoreMochaGlobals = (globalScope, stored) => {
    globalScope = globalScope || global;
    stored = stored || storedMochaGlobals;
    return utils.copyMethods(stored, globalScope, MOCHA_METHODS);
};

API.setGlobals = globalScope => {
    globalScope = globalScope || global;
    return utils.copyMethods(API, globalScope, MOCHA_METHODS);
};

module.exports = API;