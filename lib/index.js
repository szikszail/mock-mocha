'use strict';

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
        this.delayed = true;
    },

    clear() {
        this.describes = [];
        this.its = [];
        this.hooks = [];
        this.delayed = false;
    },

    saveMochaGlobals(globalScope) {
        globalScope = globalScope || global;
        this.storedMochaGlobals = {};
        return utils.copyMethods(globalScope, this.storedMochaGlobals, MOCHA_METHODS);
    },

    restoreMochaGlobals(globalScope, stored) {
        globalScope = globalScope || global;
        stored = stored || this.storedMochaGlobals;
        return utils.copyMethods(stored, globalScope, MOCHA_METHODS);
    },

    setGlobals(globalScope){
        globalScope = globalScope || global;
        return utils.copyMethods(this, globalScope, MOCHA_METHODS);
    }
};

[Test, Describe, It, Before, BeforeEach, AfterEach, After].forEach(type => {
    type.setupAPI(API);
});

module.exports = API;