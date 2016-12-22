'use strict';

const Test = require('./Test');

class Describe extends Test {
    execute() {
        const that = this._getThis();
        this.test && this.test.call(that);
    }

    static setupAPI(api) {
        api.Describe = Describe;
        api.describe = (description, test) => {
            api.describes.push(new Describe(description, test));
        };
        api.describe.only = (description, test) => {
            api.describes.push(new Describe(description, test, Test.STATUS.ONLY));
        };
        api.describe.skip = (description, test) => {
            api.describes.push(new Describe(description, test, Test.STATUS.SKIP));
        };
    }
}

module.exports = Describe;