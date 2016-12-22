'use strict';

const mocks = require('../lib/index.js');
const expect = require('chai').expect;

const fail = v => expect(v).to.be.undefined;

describe("integration", () => {
    const moduleToRequire = require.resolve('./integration-test.js');

    beforeEach(() => {
        mocks.saveMochaGlobals();
        mocks.setGlobals();
        mocks.clear();
        mocks.require(__dirname, './integration-test.js');
    });

    it("should define one root suite", () => {
        expect(mocks.describes.length).to.equal(1);
    });

    describe("root suite", () => {
        beforeEach(() => {
            mocks.describes[0].execute();
        });

        it("should define one more nested suite", () => {
            expect(mocks.describes.length).to.equal(2);
        });

        it("should define three test", () => {
            expect(mocks.its.length).to.equal(3);
        });

        for (let i = 0; i < 3; ++i) {
            it("should execute all tests #" + i, () => {
                return mocks.its[i].execute();
            });
        }
   
        it("should define one hook", () => {
            expect(mocks.hooks.length).to.equal(1);
        });

        it("should execute hook", () => {
            return mocks.hooks[0].execute();
        });

        describe("nested suite", () => {
            beforeEach(() => {
                mocks.describes[1].execute();
            });

            it("should define two more hooks", () => {
                expect(mocks.hooks.length).to.equal(3);
            });

            for (let i = 1; i < 3; ++i) {
                it("should execute all new hooks #" + i, () => {
                    return mocks.hooks[i].execute();
                });
            }

            it("should define one more test", () => {
                expect(mocks.its.length).to.equal(4);
            });

            it("should execute the nested test", () => {
                return mocks.its[3].execute();
            });
        });
    });

    afterEach(() => {
        mocks.restoreMochaGlobals(global);
    });
});