# mock-mocha

[![Build Status](https://travis-ci.org/szikszail/mock-mocha.svg?branch=master)](https://travis-ci.org/szikszail/mock-mocha) [![dependency Status](https://david-dm.org/szikszail/mock-mocha.svg)](https://david-dm.org/szikszail/mock-mocha) [![devDependency Status](https://david-dm.org/szikszail/mock-mocha/dev-status.svg)](https://david-dm.org/szikszail/mock-mocha#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/szikszail/mock-mocha/badge.svg?branch=master)](https://coveralls.io/github/szikszail/mock-mocha?branch=master)

To mock mocha in your test when you test your mocha tests with Mocha or Jasmine*.

_* in next minor version._

## Usage

```javascript
'use strict';

const mocks = require('mock-mocha');
const expect = require('chai').expect;

describe("testing my mocha tests", () => {
    beforeEach(() => {
        // 1. save the original test framework functions
        mocks.saveMochaGlobals();

        // 2. set mock functions to global
        mocks.setGlobals();

        // 3. clear existing data
        mocks.clear();

        // 4. require your module/file, you want to test
        // Important to pass root (__dirname) too!
        mocks.require(__dirname, '../my-test-script.js');
    });

    // 5. test your tests
    it("should make root suite", () => {
        expect(mocks.describes.length).to.equal(1);
    });

    // ... more tests

    afterEach(() => {
        // 6. restore your original test framework functions
        mocks.restoreMochaGlobals();
    });
});
```

## API

### Properties

- #### `describes`
    
  **Type**: `Array.<Describe>` - The registered test suites.