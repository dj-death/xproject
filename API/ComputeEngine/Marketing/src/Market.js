var Warehouse = require('../../Manufacturing/src/Warehouse');
var Utils = require('../../../../utils/Utils');
var SubMarket = (function () {
    function SubMarket(market, params) {
        this.deliveredQ = 0;
        // results
        this.orderedQ = 0;
        this.market = market;
        this.economy = this.market.economy;
        this.params = params;
    }
    SubMarket.prototype.init = function (product, salesForce, stockOpeningQ, lastPBacklogQ) {
        if (lastPBacklogQ === void 0) { lastPBacklogQ = 0; }
        this.product = product;
        this.salesForce = salesForce;
        this.lastPBacklogQ = lastPBacklogQ;
        // create warehouse
        this.warehouse = new Warehouse({
            lostProbability: 0,
            costs: {
                fixedAdministrativeCost: 0,
                storageUnit: 0
            }
        });
        this.warehouse.init(stockOpeningQ);
        // now work
        this.initialised = true;
    };
    Object.defineProperty(SubMarket.prototype, "soldQ", {
        get: function () {
            return this.warehouse.outQ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubMarket.prototype, "backlogQ", {
        get: function () {
            if (!this.params.acceptBacklog) {
                return 0;
            }
            return Math.round(this.warehouse.shortfallQ * (1 - this.params.dissatisfiedOrdersCancelledPercent));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubMarket.prototype, "stockQ", {
        get: function () {
            return this.warehouse.availableQ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubMarket.prototype, "salesRevenue", {
        get: function () {
            return this.soldQ * this.price;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubMarket.prototype, "ordersValue", {
        get: function () {
            return this.orderedQ * this.price;
        },
        enumerable: true,
        configurable: true
    });
    // helpers
    // actions
    SubMarket.prototype.receiveFrom = function (quantity, product, price, adsBudget) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        var value = quantity * price;
        this.deliveredQ = quantity;
        this.price = price;
        this.advertisingBudget = adsBudget;
        this.warehouse.moveIn(quantity, value);
        if (this.lastPBacklogQ > 0) {
            this.lastPBacklogQ -= this.getOrdersOf(this.lastPBacklogQ, false); // false not a new order
        }
        return true;
    };
    SubMarket.prototype.getOrdersOf = function (quantity, isNewOrder) {
        if (isNewOrder === void 0) { isNewOrder = true; }
        if (!this.initialised) {
            console.log('not initialised');
            return 0;
        }
        if (isNewOrder) {
            this.orderedQ += quantity;
        }
        var deliveredQ;
        // normal material from stock
        deliveredQ = this.warehouse.moveOut(quantity, true); // true to accept even if there is a shortfall
        if (deliveredQ < quantity) {
        }
        return deliveredQ;
    };
    SubMarket.prototype.returnForRepair = function (quantity) {
        this.product.returnForRepair(quantity);
    };
    return SubMarket;
})();
var Market = (function () {
    function Market(params) {
        this.params = params;
    }
    Market.prototype.init = function (economy, products, salesForce, transport, stocksOpeningQs, lastPBacklogQs) {
        if (lastPBacklogQs === void 0) { lastPBacklogQs = []; }
        this.economy = economy;
        this.salesForce = salesForce;
        this.transport = transport;
        this.transport.init(this);
        this.salesForce.market = this;
        var i = 0, len = products.length, productCode, subMarket;
        this.subMarkets = [];
        for (; i < len; i++) {
            productCode = products[i].params.code;
            subMarket = new SubMarket(this, this.params);
            subMarket.init(products[i], salesForce, stocksOpeningQs[i], lastPBacklogQs[i]);
            this.subMarkets[productCode] = subMarket;
        }
        // now work
        this.initialised = true;
    };
    Object.defineProperty(Market.prototype, "salesRevenue", {
        // results
        get: function () {
            // aggregate sales revenue of all subMarkets
            return Utils.sums(this.subMarkets, "salesRevenue");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Market.prototype, "soldUnitsNb", {
        get: function () {
            return Utils.sums(this.subMarkets, "soldQ");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Market.prototype, "ordersValue", {
        get: function () {
            return Utils.sums(this.subMarkets, "ordersValue");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Market.prototype, "advertisingCost", {
        get: function () {
            var total = 0, i = 0, len = this.subMarkets.length;
            total += this.corporateComBudget;
            for (; i < len; i++) {
                total += this.subMarkets[i].advertisingBudget;
            }
            return total;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Market.prototype, "creditControlCost", {
        // costs 
        get: function () {
            return this.soldUnitsNb * (this.params.costs.creditControlUnitCost + this.params.costs.creditCardRatePerUnitSold);
        },
        enumerable: true,
        configurable: true
    });
    // actions
    Market.prototype.receiveFrom = function (quantity, product, price, adsBudget) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        this.transport.load(quantity / product.params.containerCapacityUnitsNb);
        var subMarket = this.subMarkets[product.params.code];
        return subMarket && subMarket.receiveFrom.apply(subMarket, arguments);
        product.params.containerCapacityUnitsNb;
    };
    Market.prototype.setCorporateCom = function (corporateComBudget) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        this.corporateComBudget = corporateComBudget;
        return true;
    };
    // for test purpose
    Market.prototype.__simulate = function (orders) {
        var i = 0, len = orders.length;
        for (; i < len; i++) {
            this.subMarkets[i].getOrdersOf(orders[i]);
        }
    };
    return Market;
})();
module.exports = Market;
//# sourceMappingURL=Market.js.map