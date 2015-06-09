var Factory = (function () {
    function Factory() {
    }
    Object.defineProperty(Factory.prototype, "spaceNeeded", {
        // results
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    // actions
    Factory.prototype.produce = function () {
    };
    Factory.prototype.extendSpace = function (extension) {
    };
    return Factory;
})();
module.exports = Factory;
//# sourceMappingURL=Factory.js.map