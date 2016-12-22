'use strict';

const utils = require('./utils');

class Test {
    constructor(type, description, test) {
        this.type = type;
        this.description = description;
        this.test = test;
    }

    _getThis() {
        const self = this;
        return {
            skip() {
                self.type = Test.STATUS.SKIP;
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
                } catch (e) {
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
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static setupAPI(api) {
        api.STATUS = Test.STATUS;
    }
}

Test.STATUS = {OK: 1, ONLY: 2, SKIP: 3};

module.exports = Test;