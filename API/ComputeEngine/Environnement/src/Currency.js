var Currency = (function () {
    function Currency(params) {
        this.exchangeRate = 1;
        this.params = params;
    }
    Currency.prototype.syncExchangeRate = function (newRate) {
        this.exchangeRate = newRate;
    };
    return Currency;
})();
module.exports = Currency;
//# sourceMappingURL=Currency.js.map