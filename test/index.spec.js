'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const API = require('../lib');

const fail = e => expect(e).to.be.undefined;

describe("API", () => {
    beforeEach(() => {
        API.clear();
    });

    describe("Run", () => {
        it("should have mock of run method", () => {
            expect(API.run).to.be.defined;
        });

        it("should indicate whether execution delayed or not", () => {
            expect(API.delayed).to.be.false;

            API.run();

            expect(API.delayed).to.be.true;
        });
    });

    describe("Describe", () => {
        const suiteName = "It's a test suite";

        it("should have mock of describe method", () => {
            expect(API.describe).to.be.defined;
        });

        it("should have mock of describe.only method", () => {
            expect(API.describe.only).to.be.defined;
        });

        it("should have mock of describe.skiP method", () => {
            expect(API.describe.skip).to.be.defined;
        });

        describe("running", () => {
            const createSuite = fn => new API.Describe(API.STATUS.OK, suiteName, fn);

            it("should have method to execute defined suite", () => {
                let called = false;
                const test = () => {
                    called = true;
                };
                const suite = createSuite(test);
                suite.execute();
                expect(called).to.be.true;
            });

            it("should support of skipping normal function suite conditionally", () => {
                let called = false;
                const test = function () {
                    called = true;
                    this.skip();
                };
                const suite = createSuite(test);
                suite.execute();
                expect(called).to.be.true;
                expect(suite.type).to.equal(API.STATUS.SKIP);
            });
        });

        describe("usage", () => {
            const testSuite = () => '';

            it("should register mocked test suite with describe", () => {
                API.describe(suiteName, testSuite);

                expect(API.describes.length).to.equal(1);

                const registeredSuite = API.describes[0];
                expect(registeredSuite).to.be.an.instanceof(API.Describe);
                expect(registeredSuite.type).to.equal(API.STATUS.OK);
                expect(registeredSuite.description).to.equal(suiteName);
                expect(registeredSuite.test).to.equal(testSuite);
            });

            it("should register mocked test suite with describe.skip", () => {
                API.describe.skip(suiteName, testSuite);

                expect(API.describes.length).to.equal(1);

                const registeredSuite = API.describes[0];
                expect(registeredSuite).to.be.an.instanceof(API.Describe);
                expect(registeredSuite.type).to.equal(API.STATUS.SKIP);
                expect(registeredSuite.description).to.equal(suiteName);
                expect(registeredSuite.test).to.equal(testSuite);
            });

            it("should register mocked test suite with describe.only", () => {
                API.describe.only(suiteName, testSuite);

                expect(API.describes.length).to.equal(1);

                const registeredSuite = API.describes[0];
                expect(registeredSuite).to.be.an.instanceof(API.Describe);
                expect(registeredSuite.type).to.equal(API.STATUS.ONLY);
                expect(registeredSuite.description).to.equal(suiteName);
                expect(registeredSuite.test).to.equal(testSuite);
            });
        });
    });

    describe("It", () => {
        const testName = "It's a test";

        it("should have mock of it method", () => {
            expect(API.it).to.be.defined;
        });

        it("should have mock of it.only method", () => {
            expect(API.it.only).to.be.defined;
        });

        it("should have mock of it.skip method", () => {
            expect(API.it.skip).to.be.defined;
        });

        describe("running", () => {
            const createTest = fn => new API.It(API.STATUS.OK, testName, fn);

            it("should work with passed sync tests", done => {
                let called = false;
                const testFn = () => {
                    called = true;
                    return 1;
                };
                const test = createTest(testFn);
                test.execute().then(r => {
                    expect(r).to.equal(1);
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed sync tests", done => {
                let called = false;
                const testFn = () => {
                    called = true;
                    throw Error('e');
                };
                const test = createTest(testFn);
                test.execute().then(fail, e => {
                    expect(e).to.be.an('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with passed async tests with callbacks", done => {
                let called = false;
                const testFn = (cb) => {
                    setTimeout(function () {
                        called = true;
                        cb();
                    }, 100);
                };
                const test = createTest(testFn);
                test.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with passed async tests with promise", done => {
                let called = false;
                const testFn = () => {
                    return new Promise(resolve => {
                        setTimeout(function () {
                            called = true;
                            resolve();
                        }, 100);
                    });
                };
                const test = createTest(testFn);
                test.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed async tests with callbacks", done => {
                let called = false;
                const testFn = function (cb) {
                    setTimeout(function () {
                        called = true;
                        cb('error');
                    }, 100);
                };
                const test = createTest(testFn);
                test.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with failed async tests with promises", done => {
                let called = false;
                const testFn = function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(function () {
                            called = true;
                            reject('error');
                        }, 100);
                    });
                };
                const test = createTest(testFn);
                test.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should support of skipping normal function tests", done => {
                let called = false;
                const testFn = function () {
                    called = true;
                    this.skip();
                };
                const test = createTest(testFn);
                test.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                    expect(test.type).to.equal(API.STATUS.SKIP);
                }, fail).then(done, done);
            });
        });

        describe("usage", () => {
            const testFn = () => '';

            it("should register mocked test with it", () => {
                API.it(testName, testFn);

                expect(API.its.length).to.equal(1);

                const registeredTest = API.its[0];
                expect(registeredTest).to.be.an.instanceof(API.It);
                expect(registeredTest.type).to.equal(API.STATUS.OK);
                expect(registeredTest.description).to.equal(testName);
                expect(registeredTest.test).to.equal(testFn);
            });

            it("should register mocked test with it.skip", () => {
                API.it.skip(testName, testFn);

                expect(API.its.length).to.equal(1);

                const registeredTest = API.its[0];
                expect(registeredTest).to.be.an.instanceof(API.It);
                expect(registeredTest.type).to.equal(API.STATUS.SKIP);
                expect(registeredTest.description).to.equal(testName);
                expect(registeredTest.test).to.equal(testFn);
            });

            it("should register mocked test with it.only", () => {
                API.it.only(testName, testFn);

                expect(API.its.length).to.equal(1);

                const registeredTest = API.its[0];
                expect(registeredTest).to.be.an.instanceof(API.It);
                expect(registeredTest.type).to.equal(API.STATUS.ONLY);
                expect(registeredTest.description).to.equal(testName);
                expect(registeredTest.test).to.equal(testFn);
            });
        });
    });

    describe("Before", () => {
        const hookName = "It's a hook";

        it("should have mock for before method", () => {
            expect(API.before).to.be.defined;
        });

        describe("usage", () => {
            const hookFn = () => '';

            it("should register mocked before hook with before", () => {
                API.before(hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.Before);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal('');
                expect(registeredHook.test).to.equal(hookFn);
            });

            it("should register named mocked before hook with before", () => {
                API.before(hookName, hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.Before);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal(hookName);
                expect(registeredHook.test).to.equal(hookFn);
            });
        });

        describe("running", () => {
            const createHook = fn => new API.Before(API.STATUS.OK, hookName, fn);

            it("should work with passed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    return 1;
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.equal(1);
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    throw Error('e');
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.be.an('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with passed async hooks with callbacks", done => {
                let called = false;
                const hookFn = (cb) => {
                    setTimeout(function () {
                        called = true;
                        cb();
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with passed async hooks with promise", done => {
                let called = false;
                const hookFn = () => {
                    return new Promise(resolve => {
                        setTimeout(function () {
                            called = true;
                            resolve();
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed async hooks with callbacks", done => {
                let called = false;
                const hookFn = function (cb) {
                    setTimeout(function () {
                        called = true;
                        cb('error');
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with failed async hooks with promises", done => {
                let called = false;
                const hookFn = function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(function () {
                            called = true;
                            reject('error');
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should support of skipping normal function hooks", done => {
                let called = false;
                const hookFn = function () {
                    called = true;
                    this.skip();
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                    expect(hook.type).to.equal(API.STATUS.SKIP);
                }, fail).then(done, done);
            });
        });
    });

    describe("BeforeEach", () => {
        const hookName = "It's a hook";

        it("should have mock for beforeEach method", () => {
            expect(API.beforeEach).to.be.defined;
        });

        describe("usage", () => {
            const hookFn = () => '';

            it("should register mocked before hook with beforeEach", () => {
                API.beforeEach(hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.BeforeEach);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal('');
                expect(registeredHook.test).to.equal(hookFn);
            });

            it("should register named mocked before hook with beforeEach", () => {
                API.beforeEach(hookName, hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.BeforeEach);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal(hookName);
                expect(registeredHook.test).to.equal(hookFn);
            });
        });

        describe("running", () => {
            const createHook = fn => new API.BeforeEach(API.STATUS.OK, hookName, fn);

            it("should work with passed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    return 1;
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.equal(1);
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    throw Error('e');
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.be.an('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with passed async hooks with callbacks", done => {
                let called = false;
                const hookFn = (cb) => {
                    setTimeout(function () {
                        called = true;
                        cb();
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with passed async hooks with promise", done => {
                let called = false;
                const hookFn = () => {
                    return new Promise(resolve => {
                        setTimeout(function () {
                            called = true;
                            resolve();
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed async hooks with callbacks", done => {
                let called = false;
                const hookFn = function (cb) {
                    setTimeout(function () {
                        called = true;
                        cb('error');
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with failed async hooks with promises", done => {
                let called = false;
                const hookFn = function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(function () {
                            called = true;
                            reject('error');
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should support of skipping normal function hooks", done => {
                let called = false;
                const hookFn = function () {
                    called = true;
                    this.skip();
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                    expect(hook.type).to.equal(API.STATUS.SKIP);
                }, fail).then(done, done);
            });
        });
    });

    describe("AfterEach", () => {
        const hookName = "It's a hook";

        it("should have mock for afterEach method", () => {
            expect(API.afterEach).to.be.defined;
        });

        describe("usage", () => {
            const hookFn = () => '';

            it("should register mocked before hook with afterEach", () => {
                API.afterEach(hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.AfterEach);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal('');
                expect(registeredHook.test).to.equal(hookFn);
            });

            it("should register named mocked before hook with afterEach", () => {
                API.afterEach(hookName, hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.AfterEach);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal(hookName);
                expect(registeredHook.test).to.equal(hookFn);
            });
        });

        describe("running", () => {
            const createHook = fn => new API.AfterEach(API.STATUS.OK, hookName, fn);

            it("should work with passed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    return 1;
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.equal(1);
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    throw Error('e');
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.be.an('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with passed async hooks with callbacks", done => {
                let called = false;
                const hookFn = (cb) => {
                    setTimeout(function () {
                        called = true;
                        cb();
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with passed async hooks with promise", done => {
                let called = false;
                const hookFn = () => {
                    return new Promise(resolve => {
                        setTimeout(function () {
                            called = true;
                            resolve();
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed async hooks with callbacks", done => {
                let called = false;
                const hookFn = function (cb) {
                    setTimeout(function () {
                        called = true;
                        cb('error');
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with failed async hooks with promises", done => {
                let called = false;
                const hookFn = function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(function () {
                            called = true;
                            reject('error');
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should support of skipping normal function hooks", done => {
                let called = false;
                const hookFn = function () {
                    called = true;
                    this.skip();
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                    expect(hook.type).to.equal(API.STATUS.SKIP);
                }, fail).then(done, done);
            });
        });
    });

    describe("After", () => {
        const hookName = "It's a hook";

        it("should have mock for after method", () => {
            expect(API.after).to.be.defined;
        });

        describe("usage", () => {
            const hookFn = () => '';

            it("should register mocked before hook with after", () => {
                API.after(hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.After);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal('');
                expect(registeredHook.test).to.equal(hookFn);
            });

            it("should register named mocked before hook with after", () => {
                API.after(hookName, hookFn);

                expect(API.hooks.length).to.equal(1);

                const registeredHook = API.hooks[0];
                expect(registeredHook).to.be.an.instanceof(API.After);
                expect(registeredHook.type).to.equal(API.STATUS.OK);
                expect(registeredHook.description).to.equal(hookName);
                expect(registeredHook.test).to.equal(hookFn);
            });
        });

        describe("running", () => {
            const createHook = fn => new API.After(API.STATUS.OK, hookName, fn);

            it("should work with passed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    return 1;
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.equal(1);
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed sync hooks", done => {
                let called = false;
                const hookFn = () => {
                    called = true;
                    throw Error('e');
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.be.an('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with passed async hooks with callbacks", done => {
                let called = false;
                const hookFn = (cb) => {
                    setTimeout(function () {
                        called = true;
                        cb();
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with passed async hooks with promise", done => {
                let called = false;
                const hookFn = () => {
                    return new Promise(resolve => {
                        setTimeout(function () {
                            called = true;
                            resolve();
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                }, fail).then(done, done);
            });

            it("should work with failed async hooks with callbacks", done => {
                let called = false;
                const hookFn = function (cb) {
                    setTimeout(function () {
                        called = true;
                        cb('error');
                    }, 100);
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should work with failed async hooks with promises", done => {
                let called = false;
                const hookFn = function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(function () {
                            called = true;
                            reject('error');
                        }, 100);
                    });
                };
                const hook = createHook(hookFn);
                hook.execute().then(fail, e => {
                    expect(e).to.equal('error');
                    expect(called).to.be.true;
                }).then(done, done);
            });

            it("should support of skipping normal function hooks", done => {
                let called = false;
                const hookFn = function () {
                    called = true;
                    this.skip();
                };
                const hook = createHook(hookFn);
                hook.execute().then(r => {
                    expect(r).to.be.undefined;
                    expect(called).to.be.true;
                    expect(hook.type).to.equal(API.STATUS.SKIP);
                }, fail).then(done, done);
            });
        });
    });

    describe("Globals", () => {
        const MOCHA_METHODS = ['before', 'beforeEach', 'afterEach', 'after', 'describe', 'it', 'run'];

        describe("Injecting", () => {
            it("should have method to set mocks", () => {
                expect(API.setGlobals).to.be.defined;
            });

            MOCHA_METHODS.forEach(method => {
                it(`should support inject ${method} method to any global`, () => {
                    const myGlobal = API.setGlobals({});
                    expect(myGlobal[method]).to.equal(API[method]);
                });
            });
        });

        describe("Storing Mocha original", () => {
            it("should have method to save original Mocha methods", () => {
                expect(API.saveMochaGlobals).to.be.defined;
            });

            MOCHA_METHODS.forEach(method => {
                it(`should support store ${method} method from any global`, () => {
                    const stored = API.saveMochaGlobals(API);
                    expect(stored[method]).to.equal(API[method]);
                });
            });
        });

        describe("Restoring stored Mocha originals", () => {
            const ORIGINAL_GLOBAL = MOCHA_METHODS.reduce((g, method) => {
                g[method] = () => '';
                return g;
            }, {});

            it("should have method to restore saved original Mocha methods", () => {
                expect(API.restoreMochaGlobals).to.be.defined;
            });

            MOCHA_METHODS.forEach(method => {
                it(`should support restoring ${method} method from any saved originals`, () => {
                    API.saveMochaGlobals(ORIGINAL_GLOBAL);
                    API.setGlobals(ORIGINAL_GLOBAL);
                    API.restoreMochaGlobals(ORIGINAL_GLOBAL);
                    expect(ORIGINAL_GLOBAL[method]).to.not.equal(API[method]);
                });
            });

        });
    });

    describe("Require", () => {
        it("should not use cache when requiring a module", done => {
            const firstDate = API.require(__dirname, './require-test.js');

            setTimeout(() => {
                const secondDate = API.require(__dirname, './require-test.js');
                expect(firstDate).to.not.equal(secondDate);
                done();
            }, 100);
        });
    });
});