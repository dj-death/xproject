var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RawMaterial = require('../API/ComputeEngine/Manufacturing/src/RawMaterial');
var Supplier = require('../API/ComputeEngine/Manufacturing/src/Supplier');
var Warehouse = require('../API/ComputeEngine/Manufacturing/src/Warehouse');
var ENUMS = require('../API/ComputeEngine/Manufacturing/src/ENUMS');
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
    spaceNeeded: 0.005
});
var supplier = new Supplier({
    name: "Supplier",
    availableFutures: [
        { term: ENUMS.FUTURES.IMMEDIATE, basePrice: 39.252 },
        { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 32.615 },
        { term: ENUMS.FUTURES.SIX_MONTH, basePrice: 29.748 }
    ],
    availableQualities: [
        { index: 100, premium: 0 },
        { index: 200, premium: 0.5 }
    ],
    payments: [
        { credit: ENUMS.CREDIT.CASH, part: 0.5 },
        { credit: ENUMS.CREDIT.THREE_MONTH, part: 0.5 }
    ],
    deliveryDelai: ENUMS.DELIVERY.IMMEDIATE,
    discountRate: 0,
    interestRate: 0,
    rebateRate: 0
});
var rmWarehouse = new RMWarehouse({
    costs: {
        storageUnit: 2.5
    }
});
material.init([supplier], rmWarehouse);
module.exports = {
    material: material
};
//# sourceMappingURL=Materials.js.map