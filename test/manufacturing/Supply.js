var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RawMaterial = require('../../API/ComputeEngine/Manufacturing/src/RawMaterial');
var Supplier = require('../../API/ComputeEngine/Manufacturing/src/Supplier');
var Warehouse = require('../../API/ComputeEngine/Manufacturing/src/Warehouse');
var ENUMS = require('../../API/ComputeEngine/Manufacturing/src/ENUMS');
var RMWarehouse = (function (_super) {
    __extends(RMWarehouse, _super);
    function RMWarehouse() {
        _super.apply(this, arguments);
    }
    return RMWarehouse;
})(Warehouse);
var material = new RawMaterial({
    label: "Material",
    CO2Footprint: {
        kwh: 0,
        weight: 0
    },
    spaceNeeded: 0.005,
    canUnplannedMaterialPurchases: true
});
var supplier = new Supplier({
    name: "Supplier",
    arePricesStable: false,
    availableFutures: {
        "IMMEDIATE": { term: ENUMS.FUTURES.IMMEDIATE, basePrice: 39.252 },
        "THREE_MONTH": { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 32.615 },
        "SIX_MONTH": { term: ENUMS.FUTURES.SIX_MONTH, basePrice: 29.748 }
    },
    availableQualities: {
        "MQ": { index: 100, premium: 0 },
        "HQ": { index: 200, premium: 0.5 }
    },
    payments: {
        "CASH": { credit: ENUMS.CREDIT.CASH, part: 0.5 },
        "THREE_MONTH": { credit: ENUMS.CREDIT.THREE_MONTH, part: 0.5 }
    },
    deliveryDelai: ENUMS.DELIVERY.IMMEDIATE,
    discountRate: 0,
    interestRate: 0,
    rebateRate: 0,
    unplannedPurchasesPremium: 0.1
});
var rmWarehouse = new RMWarehouse({
    lostProbability: 0,
    costs: {
        storageUnit: 2.5,
        fixedAdministrativeCost: 7500
    }
});
module.exports = {
    materials: [material],
    suppliers: [supplier],
    warehouses: [rmWarehouse]
};
//# sourceMappingURL=Supply.js.map