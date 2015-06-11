var Warehouse = require('./Warehouse');
var Utils = require('../../../../utils/Utils');
var Product = (function () {
    function Product(params) {
        // result
        this.scheduledNb = 0;
        this.producedNb = 0;
        this.rejectedNb = 0;
        this.servicedQ = 0;
        this.params = params;
    }
    Product.prototype._calcRejectedUnitsNbOf = function (quantity) {
        var landa, probability, value = 0, i = 0;
        probability = Math.random() * this.params.rejectedProbability;
        landa = probability * quantity;
        return Math.round(Utils.getPoisson(landa));
    };
    Product.prototype.init = function (semiProducts) {
        this.semiProducts = semiProducts;
        this.warehouse = new Warehouse({
            lostProbability: this.params.lostProbability,
            costs: {
                fixedAdministrativeCost: 0,
                storageUnit: 0
            }
        });
        this.warehouse.init(0);
        // now everything is ok
        this.initialised = true;
    };
    Object.defineProperty(Product.prototype, "availableNb", {
        get: function () {
            return this.warehouse.availableQ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "lostNb", {
        get: function () {
            return this.warehouse.lostQ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "guaranteeServicingCost", {
        get: function () {
            return this.servicedQ * this.params.costs.guaranteeServicingCharge;
        },
        enumerable: true,
        configurable: true
    });
    // actions
    Product.prototype.manufacture = function (quantity) {
        var semiProductsDecisions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            semiProductsDecisions[_i - 1] = arguments[_i];
        }
        if (!this.initialised) {
            console.log('Product not initialised to Manufacture');
            return 0;
        }
        this.lastManufacturingParams = arguments;
        this.scheduledNb += quantity;
        this.rejectedNb += this._calcRejectedUnitsNbOf(quantity);
        quantity += this.rejectedNb;
        var i = 0, len = this.semiProducts.length, manufacturingUnitTime, premiumQualityProp, unitsNb, result = [], minUnitsNb;
        for (; i < len; i++) {
            manufacturingUnitTime = semiProductsDecisions.shift();
            premiumQualityProp = semiProductsDecisions.shift();
            this.semiProducts[i].manufacture(quantity, manufacturingUnitTime, premiumQualityProp);
            unitsNb = this.semiProducts[i].deliverTo(quantity);
            result.push(unitsNb);
        }
        // we sort the results ASC and we take the first as it the min value
        minUnitsNb = result.sort()[0];
        this.producedNb += minUnitsNb;
        // now supply the stock
        this.warehouse.moveIn(this.producedNb - this.lostNb);
        return minUnitsNb;
    };
    Product.prototype.deliverTo = function (quantity, market, price, advertisingBudget) {
        if (!this.initialised) {
            console.log('Product not initialised');
            return 0;
        }
        var diff, compensation, args = [];
        diff = quantity - this.warehouse.availableQ;
        // on peut pas satisfaire la totalité de la demande
        if (diff > 0) {
            args.concat([], this.lastManufacturingParams);
            args[0] = diff;
            compensation = this.manufacture.apply(this, args);
            quantity = this.warehouse.availableQ + compensation;
        }
        this.warehouse.moveOut(quantity);
        market.receiveFrom(quantity, this, price, advertisingBudget);
        return quantity;
    };
    Product.prototype.developWithBudget = function (developmentBudget) {
        this.developmentBudget = developmentBudget;
        return true;
    };
    Product.prototype.takeUpImprovements = function (isOk) {
        if (!isOk) {
        }
    };
    Product.prototype.returnForRepair = function (quantity) {
        this.servicedQ += quantity;
    };
    return Product;
})();
module.exports = Product;
//# sourceMappingURL=Product.js.map