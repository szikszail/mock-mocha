'use strict';

class Utils {
    static hasCallback(fn) {
        if (typeof fn !== "function") {
            return false;
        }

        const source = Function.prototype.toString.call(fn);
        const asyncRx = /^(?:function\s*[^\(]*\((.*)\))|(?:\(?([^\s\)]*)\)?\s*=>)/mi;
        const match = source.match(asyncRx);

        return match && (!!match[1] || !!match[2]);
    }

    static copyMethods(from, to, methods) {
        methods = methods || [];
        from = from || {};
        to = to || {};
        if (!Array.isArray(methods)) {
            methods = [methods];
        }
        methods.forEach(method => {
            to[method] = from[method];
        });
        return to;
    }
}

module.exports = Utils;