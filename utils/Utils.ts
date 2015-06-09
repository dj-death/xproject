/**
* Utils
* @name Utils
* @namespace
*
* Cloud Module
*
* Copyright 2015 DIDI Mohamed, Inc.
*/

/**
 * Get the version of the module.
 * @return {String}
 */

//require('cloud/Engine/es6-shim.js');

var enumerables: string[] = [/*'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',*/'valueOf', 'toLocaleString', 'toString', 'constructor'];

function populateArray(value: number, length: number): number[] {
    var arr = [],
        i = 0;

    for (; i < length; i++) {
        arr.push(value);
    }

    return arr;
}

export function getPoisson(lambda: number): number {
    var L: number = Math.exp(-lambda),
        p: number = 1.0,
        k: number = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
}


export function sums(collection, property: string, coefficients?): number {
    var i: number,
        len: number = collection.length,
        sum: number = 0;

    if (!coefficients || typeof coefficients === 'number') { // not array
        coefficients = populateArray(coefficients || 1, len);
    }

    for (i = 0; i < len; i++) {
        sum += collection[i][property] * coefficients[i];
    }

    return sum;
}


export function aggregate(collection, property: string, operation, coefficients): number {
    var i: number,
        len: number = collection.length,
        aggregation: number = 0;

    if (!coefficients || typeof coefficients === 'number') { // not array
        coefficients = populateArray(coefficients || 1, len);
    }

    for (i = 0; i < len; i++) {
        aggregation += operation.call(null, collection[i][property], coefficients[i]);
    }

    return aggregation;
}


function cloneFn(item) {
    if (item === null || item === undefined) {
        return item;
    }

    // DOM nodes
    // TODO proxy this to Ext.Element.clone to handle automatic id attribute changing
    // recursively
    if (item.nodeType && item.cloneNode) {
        return item.cloneNode(true);
    }

    var type = toString.call(item),
        i, j, k, clone, key;

    // Date
    if (type === '[object Date]') {
        return new Date(item.getTime());
    }

    // Array
    if (type === '[object Array]') {
        i = item.length;

        clone = [];

        while (i--) {
            clone[i] = cloneFn(item[i]);
        }
    }
    // Object
    else if (type === '[object Object]' && item.constructor === Object) {
        clone = {};

        for (key in item) {
            clone[key] = cloneFn(item[key]);
        }

        if (enumerables) {
            for (j = enumerables.length; j--;) {
                k = enumerables[j];
                if (item.hasOwnProperty(k)) {
                    clone[k] = item[k];
                }
            }
        }
    }

    return clone || item;
}

export function ObjectApply(destination, ...rest: any[]): Object {
    var i = 1,
        ln = arguments.length,
        object, key, value, sourceKey;

    for (; i < ln; i++) {
        object = arguments[i];

        for (key in object) {
            value = object[key];
            if (value && value.constructor === Object) {
                sourceKey = destination[key];
                if (sourceKey && sourceKey.constructor === Object) {
                    ObjectApply(sourceKey, value);
                } else {
                    destination[key] = cloneFn(value);
                }
            } else {
                destination[key] = value;
            }
        }
    }

    return destination;
}