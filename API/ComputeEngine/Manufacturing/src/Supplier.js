var ENUMS = require('./ENUMS');
var Supplier = (function () {
    function Supplier(supplierParams) {
        // result
        this.purchasesValue = 0;
        this.unplannedPurchasesQ = 0;
        this.params = supplierParams;
    }
    Supplier.prototype.init = function (material) {
        this.material = material;
        // now it's ok
        this.initialised = true;
    };
    Supplier.prototype.syncPrices = function (marketPrices, marketQualitiesPremium) {
        if (marketQualitiesPremium === void 0) { marketQualitiesPremium = []; }
        if (this.params.arePricesStable) {
            return false;
        }
        var i = 0, len = marketPrices.length, term, future, index, quality;
        for (; i < len; i++) {
            term = marketPrices[i].term;
            future = this.params.availableFutures[ENUMS.FUTURES[term]];
            if (future.term == term) {
                future.basePrice = marketPrices[i].basePrice;
            }
        }
        i = 0;
        len = marketQualitiesPremium.length;
        for (; i < len; i++) {
            index = marketQualitiesPremium[i].index;
            quality = this.params.availableQualities[ENUMS.QUALITY[index]];
            if (index == quality.index) {
                quality.premium = marketQualitiesPremium[i].premium;
            }
        }
    };
    // helpers
    Supplier.prototype._getPrice = function (quality, term /*, credit: ENUMS.CREDIT*/) {
        var price, basePrice = this.params.availableFutures[ENUMS.FUTURES[term]].basePrice, qualityPremium = this.params.availableQualities[ENUMS.QUALITY[quality]].premium;
        price = basePrice * (1 + qualityPremium);
        return price;
    };
    // actions
    Supplier.prototype.order = function (quantity, quality, term, unplannedPurchases) {
        if (quality === void 0) { quality = ENUMS.QUALITY.MQ; }
        if (term === void 0) { term = ENUMS.FUTURES.IMMEDIATE; }
        if (unplannedPurchases === void 0) { unplannedPurchases = false; }
        if (!this.initialised) {
            console.log('not initialised');
            console.info(arguments);
            return false;
        }
        // 9di bli moujoud matmchich blach
        quality = this.params.availableQualities[ENUMS.QUALITY[quality]] !== undefined ? quality : ENUMS.QUALITY[Object.keys(this.params.availableQualities)[0]];
        term = this.params.availableFutures[ENUMS.FUTURES[term]] !== undefined ? term : ENUMS.FUTURES[Object.keys(this.params.availableFutures)[0]];
        var orderValue, price;
        price = this._getPrice(quality, term);
        orderValue = price * quantity;
        if (unplannedPurchases) {
            orderValue *= (1 + this.params.unplannedPurchasesPremium);
            this.unplannedPurchasesQ += quantity;
        }
        this.purchasesValue += orderValue;
        this.material.supply(quantity, orderValue, term);
        return true;
    };
    return Supplier;
})();
module.exports = Supplier;
//# sourceMappingURL=Supplier.js.map