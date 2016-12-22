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

For tips about **How to test you tests** you could check [how-to.spec.js](/test/how-to.spec.js).

## API

### Properties

- #### `describes`

  The registered test suites, in order of the execution of test suites.
    
  **Type**: `Array.<Describe>`

- #### `its`

  The registered tests, in order of the execution of tests.

  **Type**: `Array.<It>`

- #### `hooks`

  The registered hooks, in order of the registration of hooks.

  **Type**: `Array.<Before|BeforeEach|AfterEach|After>`

- #### `delayed`

  Indicates whether Mocha's run has been used.

  **Type**: `Boolean`

- #### `storedMochaGlobals`

  All previously stored original Mocha global methods, like `describe`, `it`, etc.

  **Type**: `Object.<String, Function>`

- #### `STATUS`

  Possible statuses of `Describe`, `It` and `Hook` types.

  Values: `OK`, `SKIP`, `ONLY`

  **Type**: `Object.<String, Number>`

### Methods

- #### `clear()`

  Sets all status properties (`describes`, `its`, `hooks` and `delayed`) to its default value.

- #### `require(root, pathOfFile)`

  Requires the given file (based on the given root, usually `__dirname`) with `require`, but without its default caching.

  **Params**:
    - `root {String}` - the root of the current file, usually `__dirname`
    - `pathOfFile {String}` - the relative path to the file needs to be tested, relative to the curent test spec file

  **Retuns**: `{*}`

- #### `saveMochaGlobals([globalScope])`

  Saves the global methods of Mocha to `storedMochaGlobals` from `GLOBAL` or the given object and returns those.

  **Params**:
    - `globalScope {Object} - the global scope, from the methods needs to be saved. Optional, by default it's NodeJS's `GLOBAL`

  **Returns**: `{Object.<String, Function>}`

- #### `restoreMochaGlobals([globalScope], [stored])`

  Restores the previously saved (or given) Mocha global methods to `GLOBAL` or to the given object and returns the new scope.

  **Params**:
    - `globalScope {Object}` - the global scope, to the methods needs to be restored. Optional, by default it's NodeJS's `GLOBAL`
    - `stored {Object}` - the object, where the original methods are stored. Optional, by default it's `storedMochaGlobals`

  **Returns**: `{Object}`

- #### `setGlobals([globalScope])`

  Decorates `GLOBAL` or the given object with the mock Mocha global methods.

  **Params**:
    - `globalScope {Object}` - the global scope, which needs to be decorated with mocks. Optional, by default it's NodeJS's `GLOBAL`

  **Returns**: `{Object}`

### Types

- #### `Describe` - test suite
  
  **Properties**:
    - `description {String}`
    - `test {Function}`
    - `type {STATUS|Number}`

  **Methods**:
    - `execute() : void` - executes `test`, which is a **sync** function

- #### `It` - test

  **Properties**:
    - `description {String}`
    - `test {Function}`
    - `type{STATUS|Number}`

  **Methods**:
    - `execute() : Promise` - executes `test`, which could be both **sync** and **async**

- #### `Before`, `BeforeEach`, `AfterEach`, `After` - hooks

  **Properties**:
    - `description {String}`
    - `test {Function}`
    - `type{STATUS|Number}`

  **Methods**:
    - `execute() : Promise` - executes `test`, which could be both **sync** and **async**

**Note**: In case of `It` and all hooks, during execution the executed test/hook can call `this.skip()` as it could be done in Mocha. In this case `type` of the given `It`/hooks will change to `SKIP`.

### Mock Mocha methods

The mocked mocha methods are:

| Mock method                         | Action when called                                   |
|:------------------------------------|:-----------------------------------------------------|
| `describe(description, suite)`      | Adds new `Describe` to `describes` with `OK` type.   |
| `describe.skip(description, suite)` | Adds new `Describe` to `describes` with `SKIP` type. |
| `describe.only(description, suite)` | Adds new `Describe` to `describes` with `ONLY` type. |
| `it(description, test)`             | Adds new `It` to `its` with `OK` type.               |
| `it.skip(description, test)`        | Adds new `It` to `its` with `SKIP` type.             |
| `it.only(description, test)`        | Adds new `It` to `its` with `ONLY` type.             |
| `before([description,] hook)`       | Adds new `Before` to `hooks` wth `OK` type.          |
| `beforeEach([description,] hook)`   | Adds new `BeforeEach` to `hooks` with `OK` type.     |
| `afterEach([description,] hook)`    | Adds new `AfterEach` to `hooks` with `OK` type.      |
| `after([description,] hook)`        | Adds new `After` to `hooks` with `OK` type.          |
| `run()`                             | Sets `delayed` to `true`.                            |