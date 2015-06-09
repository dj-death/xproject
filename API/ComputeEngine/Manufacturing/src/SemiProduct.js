var Warehouse = require('./Warehouse');
var ENUMS = require('./ENUMS');
var Utils = require('../../../../utils/Utils');
var SemiProduct = (function () {
    function SemiProduct(semiProductParams) {
        // results
        this.producedNb = 0;
        this.scheduledNb = 0;
        this.rejectedNb = 0;
        this.params = semiProductParams;
    }
    SemiProduct.prototype.init = function (atelier, rawMaterial, subContracter) {
        this.params.manufacturingCfg.atelier = atelier;
        this.params.rawMaterialConsoCfg.rawMaterial = rawMaterial;
        this.subContracter = subContracter;
        // init it by the semiProduct
        this.subContracter && this.subContracter.init(this);
        this.warehouse = new Warehouse({
            lostProbability: this.params.lostProbability,
            costs: {
                fixedAdministrativeCost: 0,
                storageUnit: 0
            }
        });
        this.warehouse.init(0);
        // now it's ok
        this.initialised = true;
    };
    // helpers
    SemiProduct.prototype._calcRejectedUnitsNbOf = function (quantity) {
        var landa, probability, value = 0, i = 0;
        probability = Math.random() * this.params.rejectedProbability;
        landa = probability * quantity;
        return Math.round(Utils.getPoisson(landa));
    };
    Object.defineProperty(SemiProduct.prototype, "availableNb", {
        get: function () {
            return this.warehouse.availableQ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SemiProduct.prototype, "lostNb", {
        get: function () {
            return this.warehouse.lostQ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SemiProduct.prototype, "rawMaterialTotalConsoQ", {
        get: function () {
            return this.producedNb * this.params.rawMaterialConsoCfg.consoUnit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SemiProduct.prototype, "manufacturingTotalHoursNb", {
        get: function () {
            return this.producedNb * this.manufacturingUnitTime / 60;
        },
        enumerable: true,
        configurable: true
    });
    // actions
    SemiProduct.prototype.manufacture = function (quantity, manufacturingUnitTime, premiumQualityProp) {
        if (premiumQualityProp === void 0) { premiumQualityProp = 0; }
        if (!this.initialised) {
            console.log('not initialised');
            return 0;
        }
        this.lastManufacturingParams = arguments;
        var mCfg = this.params.manufacturingCfg, rmCfg = this.params.rawMaterialConsoCfg, consoUnit = rmCfg.consoUnit, i = 0, done;
        this.scheduledNb += quantity;
        manufacturingUnitTime = manufacturingUnitTime < mCfg.minManufacturingUnitTime ? mCfg.minManufacturingUnitTime : manufacturingUnitTime;
        this.manufacturingUnitTime = manufacturingUnitTime;
        for (; i < quantity; i++) {
            done = mCfg.atelier && mCfg.atelier.work(manufacturingUnitTime / 60);
            if (!done && mCfg.atelier) {
                --i;
                break;
            }
            done = rmCfg.rawMaterial && rmCfg.rawMaterial.consume(consoUnit, premiumQualityProp);
            // if we have materiel but we didn'h have sufficient quantity then break;
            if (!done && rmCfg.rawMaterial) {
                --i;
                break;
            }
        }
        this.producedNb += i;
        this.warehouse.moveIn(i);
        return i;
    };
    SemiProduct.prototype.deliverTo = function (quantity) {
        var diff, compensation, args = [];
        diff = quantity - this.warehouse.availableQ;
        if (diff < 0) {
            args.concat(this.lastManufacturingParams);
            args[0] = diff;
            compensation = this.manufacture.call(args);
            quantity = this.warehouse.availableQ + compensation;
        }
        return quantity;
    };
    SemiProduct.prototype.subContract = function (unitsNb, premiumQualityProp, term) {
        if (premiumQualityProp === void 0) { premiumQualityProp = 0; }
        if (term === void 0) { term = ENUMS.FUTURES.IMMEDIATE; }
        var qualityIdx;
        qualityIdx = ENUMS.QUALITY.HQ * premiumQualityProp + ENUMS.QUALITY.MQ;
        this.subContracter.order(unitsNb, qualityIdx, term);
        return this.supply(unitsNb);
    };
    SemiProduct.prototype.supply = function (quantity, value, term) {
        if (value === void 0) { value = 0; }
        if (term === void 0) { term = ENUMS.FUTURES.IMMEDIATE; }
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        return this.warehouse.moveIn(quantity, value, term);
    };
    return SemiProduct;
})();
module.exports = SemiProduct;
//# sourceMappingURL=SemiProduct.js.map