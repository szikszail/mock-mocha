'use strict';

const expect = require('chai').expect;
const utils = require('../lib/utils.js');

describe("utilities", () => {
    describe("hasCallback", () => {
        it("should identify sync function", () =>  {
            expect(utils.hasCallback(function(){})).to.be.false;
        });

        it("should identify multi-line sync function", () => {
            expect(utils.hasCallback(function () {
                console.log('');
            })).to.be.false;
        });

        it("should identify async function", () => {
            expect(utils.hasCallback(function(cb){})).to.be.true;
        });

        it("should identify sync arrow function", () => {
            expect(utils.hasCallback(() => '')).to.be.false;
        });

        it("should identify async arrow function", () => {
            expect(utils.hasCallback((cb) => '')).to.be.true;
        });

        it("should identify short async arrow function", () => {
            expect(utils.hasCallback(cb => '')).to.be.true;
        });
    });

    describe("copyMethods", () => {
        it("should copy given methods", () => {
            const from = {
                one: () => '',
                two: () => '',
            };
            const to = utils.copyMethods(from, {}, ['one', 'two']);
            expect(to.one).to.equal(from.one);
            expect(to.two).to.equal(from.two);
        });

        it("should handle default values", () => {
            const to = utils.copyMethods(undefined, undefined, ['hello']);
            expect(to.hello).to.be.undefined;
        });
    });
});