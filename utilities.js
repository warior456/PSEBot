"use strict";

const message = require("./events/guild/message");

function addLeadingZeros(number, totalLength) {
    if(typeof number !== "number") return NaN;

    const sign = Math.sign(number);
    let res = Math.abs(number).toString();
    const toAdd = totalLength - res.length;

    if(0 < toAdd) {
        for (let i = 0; i < toAdd; i++) {
            res = "0" + res;
        }
    }

    if(sign < 0) {
        return "-" + res;
    }
    return res;
}

function A() {
    return;
}

function B() {
    return;
}

module.exports = {addLeadingZeros, A, B};