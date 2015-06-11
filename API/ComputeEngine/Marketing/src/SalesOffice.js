var Utils = require('../../../../utils/Utils');
/*
interface SalesOfficeCost {
    administrationCost: number;
    totalCost: number;
}*/
var SalesOffice = (function () {
    function SalesOffice(params) {
        this.params = params;
    }
    SalesOffice.prototype.init = function (markets) {
        this.markets = markets;
    };
    Object.defineProperty(SalesOffice.prototype, "salesRevenue", {
        // result
        get: function () {
            return Utils.sums(this.markets, "salesRevenue");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SalesOffice.prototype, "ordersValue", {
        get: function () {
            return Utils.sums(this.markets, "ordersValue");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SalesOffice.prototype, "creditControlCost", {
        // costs 
        get: function () {
            return Utils.sums(this.markets, "creditControlCost");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SalesOffice.prototype, "administrationCost", {
        get: function () {
            return this.params.costs.administrationCostRate * Math.max(this.salesRevenue, this.ordersValue);
        },
        enumerable: true,
        configurable: true
    });
    return SalesOffice;
})();
module.exports = SalesOffice;
//# sourceMappingURL=SalesOffice.js.map