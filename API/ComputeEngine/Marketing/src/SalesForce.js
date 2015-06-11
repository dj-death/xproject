var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Employee = require('../../Personnel/src/Employee');
var SalesForce = (function (_super) {
    __extends(SalesForce, _super);
    function SalesForce(params) {
        _super.call(this, params);
    }
    // helpers
    SalesForce.prototype.init = function (availablesWorkersNb, market) {
        _super.prototype.init.call(this, availablesWorkersNb);
        this.market = market;
    };
    Object.defineProperty(SalesForce.prototype, "supportCost", {
        // result
        // costs
        get: function () {
            return this.supportPerAgent * this.employeesNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SalesForce.prototype, "totalCost", {
        get: function () {
            return this.supportCost + this.commissionsCost + this.personnelCost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SalesForce.prototype, "commissionsCost", {
        get: function () {
            var commissionsBase, salesRevenue, ordersValue, commissions;
            salesRevenue = this.market.salesRevenue;
            ordersValue = this.market.ordersValue;
            commissionsBase = this.params.isCommissionsBasedOnOrders ? ordersValue : salesRevenue;
            commissions = commissionsBase * this.commissionRate;
            return commissions;
        },
        enumerable: true,
        configurable: true
    });
    // actions
    SalesForce.prototype.appoint = function (appointedNb, supportPerAgent, commissionRate) {
        this.appointedNb = appointedNb;
        this.commissionRate = commissionRate;
        this.supportPerAgent = supportPerAgent < this.params.costs.minSupportPerAgent ? this.params.costs.minSupportPerAgent : supportPerAgent;
        return true;
    };
    return SalesForce;
})(Employee.Employee);
module.exports = SalesForce;
//# sourceMappingURL=SalesForce.js.map