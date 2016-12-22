'use strict';

const TIMEOUT = 100;
const asyncCallback = done => setTimeout(done, TIMEOUT);
const asyncPromise = () => new Promise(resolve => {
    asyncCallback(resolve);
});
const sync = () => '';

describe("root suite", () => {
    before("named first hooK", () => {
        sync();
    });

    it("should be an async callback test #1", done => {
        asyncCallback(done);
    });

    it("should be an async promise test #2", () => {
        return asyncPromise();
    });

    it("should be a sync test #3", () => {
        sync();
    });

    describe("nested suite", () => {
        beforeEach(done => {
            asyncCallback(done);
        });

        afterEach(() => {
            return asyncPromise();
        });

        it("should be a nested test #4", () => {
            sync();
        });
    });
});

run();