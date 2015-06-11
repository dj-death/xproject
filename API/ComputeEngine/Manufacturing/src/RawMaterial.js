var ENUMS = require('./ENUMS');
var RawMaterial = (function () {
    function RawMaterial(rawMaterialParams) {
        this.params = rawMaterialParams;
    }
    RawMaterial.prototype.init = function (suppliers, warehouse) {
        this.suppliers = suppliers;
        // attach suppliers to this rawMateriel
        for (var i = 0, len = suppliers.length; i < len; i++) {
            this.suppliers[i].init(this);
        }
        this.warehouse = warehouse;
        // let's work
        this.initialised = true;
    };
    // actions
    RawMaterial.prototype.supply = function (quantity, value, term) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        return this.warehouse.moveIn(quantity, value, term);
    };
    RawMaterial.prototype.consume = function (quantity, premiumQualityProp) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        var deliveredQ, standardMaterialQ;
        standardMaterialQ = quantity * (1 - premiumQualityProp);
        // premium materiel work in JIT
        this.suppliers[0].order(quantity * premiumQualityProp, ENUMS.QUALITY.HQ, ENUMS.FUTURES.IMMEDIATE);
        // normal material from stock
        deliveredQ = this.warehouse.moveOut(standardMaterialQ);
        if (deliveredQ < standardMaterialQ) {
            if (!this.params.canUnplannedMaterialPurchases) {
                return false;
            }
            this.suppliers[0].order(standardMaterialQ - deliveredQ, ENUMS.QUALITY.MQ, ENUMS.FUTURES.IMMEDIATE, true);
        }
        return true;
    };
    return RawMaterial;
})();
module.exports = RawMaterial;
//# sourceMappingURL=RawMaterial.js.map