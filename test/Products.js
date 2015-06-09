var SemiProduct = require('../API/ComputeEngine/Manufacturing/src/SemiProduct');
var Product = require('../API/ComputeEngine/Manufacturing/src/Product');
var SubContracter = require('../API/ComputeEngine/Manufacturing/src/SubContracter');
var ENUMS = require('../API/ComputeEngine/Manufacturing/src/ENUMS');
var Utils = require('../utils/Utils');
var subContracterDefaultParams, alphaASubContracterParams, alphaBSubContracterParams, alphaCSubContracterParams;
subContracterDefaultParams = {
    name: "Sous-Traitant",
    arePricesStable: false,
    availableFutures: {
        "THREE_MONTH": { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 0 },
    },
    availableQualities: {
        "MQ": { index: 100, premium: 0 },
        "HQ": { index: 200, premium: 0.5 }
    },
    payments: {
        "CASH": { credit: ENUMS.CREDIT.CASH, part: 0.5 },
        "THREE_MONTH": { credit: ENUMS.CREDIT.THREE_MONTH, part: 0.5 }
    },
    deliveryDelai: ENUMS.DELIVERY.AFTERNEXT_PERIOD,
    discountRate: 0,
    interestRate: 0,
    rebateRate: 0,
    unplannedPurchasesPremium: 0
};
alphaASubContracterParams = Utils.ObjectApply({}, subContracterDefaultParams);
alphaBSubContracterParams = Utils.ObjectApply({}, subContracterDefaultParams);
alphaCSubContracterParams = Utils.ObjectApply({}, subContracterDefaultParams);
module.exports = {
    alphaA: new SemiProduct({
        label: "encours alpha Produit A",
        spaceNeeded: 0,
        CO2Footprint: null,
        manufacturingCfg: {
            minManufacturingUnitTime: 60
        },
        lostProbability: 0,
        rejectedProbability: 0,
        rawMaterialConsoCfg: {
            consoUnit: 1
        },
        costs: {
            inspectionUnit: 0,
            planningUnit: 0
        }
    }),
    betaA: new SemiProduct({
        label: "encours beta Produit A",
        spaceNeeded: 0,
        CO2Footprint: null,
        manufacturingCfg: {
            minManufacturingUnitTime: 100
        },
        rawMaterialConsoCfg: {
            consoUnit: 0
        },
        lostProbability: 0,
        rejectedProbability: 0,
        costs: {
            inspectionUnit: 0,
            planningUnit: 0
        }
    }),
    alphaB: new SemiProduct({
        label: "encours alpha Produit B",
        spaceNeeded: 0,
        CO2Footprint: null,
        manufacturingCfg: {
            minManufacturingUnitTime: 75
        },
        rawMaterialConsoCfg: {
            consoUnit: 2
        },
        lostProbability: 0,
        rejectedProbability: 0,
        costs: {
            inspectionUnit: 0,
            planningUnit: 0
        }
    }),
    betaB: new SemiProduct({
        label: "encours beta Produit B",
        spaceNeeded: 0,
        CO2Footprint: null,
        manufacturingCfg: {
            minManufacturingUnitTime: 150
        },
        rawMaterialConsoCfg: {
            consoUnit: 0
        },
        lostProbability: 0,
        rejectedProbability: 0,
        costs: {
            inspectionUnit: 0,
            planningUnit: 0
        }
    }),
    alphaC: new SemiProduct({
        label: "encours alpha Produit C",
        spaceNeeded: 0,
        CO2Footprint: null,
        manufacturingCfg: {
            minManufacturingUnitTime: 120
        },
        rawMaterialConsoCfg: {
            consoUnit: 3
        },
        lostProbability: 0,
        rejectedProbability: 0,
        costs: {
            inspectionUnit: 0,
            planningUnit: 0
        }
    }),
    betaC: new SemiProduct({
        label: "encours alpha Produit A",
        spaceNeeded: 0,
        CO2Footprint: null,
        manufacturingCfg: {
            minManufacturingUnitTime: 300
        },
        rawMaterialConsoCfg: {
            consoUnit: 0
        },
        lostProbability: 0,
        rejectedProbability: 0,
        costs: {
            inspectionUnit: 0,
            planningUnit: 0
        }
    }),
    productA: new Product({
        label: "Produit A",
        spaceNeeded: 0,
        CO2Footprint: {
            kwh: 0,
            weight: 0
        },
        rejectedProbability: 0.037,
        lostProbability: 0,
        containerCapacityUnitsNb: 500,
        costs: {
            scrapValue: 40,
            guaranteeServicingCharge: 60,
            inspectionUnit: 1,
            planningUnit: 1
        }
    }),
    productB: new Product({
        label: "Produit B",
        spaceNeeded: 0,
        CO2Footprint: {
            kwh: 0,
            weight: 0
        },
        rejectedProbability: 0.037,
        lostProbability: 0,
        containerCapacityUnitsNb: 250,
        costs: {
            scrapValue: 80,
            guaranteeServicingCharge: 150,
            inspectionUnit: 1,
            planningUnit: 1
        }
    }),
    productC: new Product({
        label: "Produit C",
        spaceNeeded: 0,
        CO2Footprint: {
            kwh: 0,
            weight: 0
        },
        rejectedProbability: 0.037,
        lostProbability: 0,
        containerCapacityUnitsNb: 125,
        costs: {
            scrapValue: 120,
            guaranteeServicingCharge: 250,
            inspectionUnit: 1,
            planningUnit: 1
        }
    }),
    alphaASubContracter: new SubContracter(alphaASubContracterParams),
    alphaBSubContracter: new SubContracter(alphaBSubContracterParams),
    alphaCSubContracter: new SubContracter(alphaCSubContracterParams)
};
//# sourceMappingURL=Products.js.map