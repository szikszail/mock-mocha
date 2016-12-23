'use strict';

const mocks = require('../lib/index.js');
const expect = require('chai').expect;

describe("integration", () => {
    const moduleToRequire = require.resolve('./integration-test.js');

    beforeEach(() => {
        // 1. save the original test framework functions
        mocks.saveMochaGlobals();

        // 2. set mock functions to global
        mocks.setGlobals();

        // 3. clear existing data
        mocks.clear();

        // 4. require your module/file, you want to test
        // Important to pass root (__dirname) too!
        mocks.require(__dirname, './integration-test.js');
    });

    it("should define one root suite", () => {
        // Test the number of suites added
        expect(mocks.describes.length).to.equal(1);
    });

    describe("root suite", () => {
        beforeEach(() => {
            // Execute the previously added suite to continue test
            mocks.describes[0].execute();
        });

        it("should define one more nested suite", () => {
            // Test the number of suites added
            expect(mocks.describes.length).to.equal(2);
        });

        it("should define three test", () => {
            // Test the number of tests added
            expect(mocks.its.length).to.equal(3);
        });

        for (let i = 0; i < 3; ++i) {
            it("should execute all tests #" + i, () => {
                // Test whether all tests executed properly
                return mocks.its[i].execute();
            });
        }

        it("should define one hook", () => {
            // Test the number of hooks added
            expect(mocks.hooks.length).to.equal(1);
        });

        it("should execute hook", () => {
            // Test whether hook executed properly
            return mocks.hooks[0].execute();
        });

        describe("nested suite", () => {
            beforeEach(() => {
                // Execute the previously added nested suite to continue test
                mocks.describes[1].execute();
            });

            it("should define two more hooks", () => {
                // Test the number of hooks added
                expect(mocks.hooks.length).to.equal(3);
            });

            for (let i = 1; i < 3; ++i) {
                it("should execute all new hooks #" + i, () => {
                    // Test whether all hooks executed properly
                    return mocks.hooks[i].execute();
                });
            }

            it("should define one more test", () => {
                // Test the number of tests added
                expect(mocks.its.length).to.equal(4);
            });

            it("should execute the nested test", () => {
                // Test whether nested tests executed properly
                return mocks.its[3].execute();
            });
        });
    });

    afterEach(() => {
        // 6. restore your original test framework functions
        mocks.restoreMochaGlobals(global);
    });
});