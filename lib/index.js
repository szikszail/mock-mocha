'use strict';

const path = require('path');
const utils = require('./utils');

const Test = require('./Test');
const Describe = require('./Describe');
const It = require('./It');
const Before = require('./Before');
const BeforeEach = require('./BeforeEach');
const AfterEach = require('./AfterEach');
const After = require('./After');

const MOCHA_METHODS = ['describe', 'it', 'before', 'beforeEach', 'afterEach', 'after', 'run'];

const API = {
    describes: [],
    its: [],
    hooks: [],
    storedMochaGlobals: {},
    delayed: false,

    run() {
       API.delayed = true;
    },

    clear() {
        API.describes = [];
        API.its = [];
        API.hooks = [];
        API.delayed = false;
    },

    require(root, module) {
        const modulePath = path.resolve(root, module);
        delete require.cache[require.resolve(modulePath)];
        return require(modulePath);
    },

    saveMochaGlobals(globalScope) {
        globalScope = globalScope || global;
        API.storedMochaGlobals = {};
        return utils.copyMethods(globalScope, API.storedMochaGlobals, MOCHA_METHODS);
    },

    restoreMochaGlobals(globalScope, stored) {
        globalScope = globalScope || global;
        stored = stored || API.storedMochaGlobals;
        return utils.copyMethods(stored, globalScope, MOCHA_METHODS);
    },

    setGlobals(globalScope){
        globalScope = globalScope || global;
        return utils.copyMethods(API, globalScope, MOCHA_METHODS);
    }
};

[Test, Describe, It, Before, BeforeEach, AfterEach, After].forEach(type => {
    type.setupAPI(API);
});

module.exports = API;