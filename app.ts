import game = require('./test/Game');

import ENUMS = require('./API/ComputeEngine/Manufacturing/src/ENUMS');

import machines = require('./test/Machines');
import supply = require('./test/Supply');
import products = require('./test/Products');
import ateliers = require('./test/Ateliers');
import workers = require('./test/Workers');

game.init({
    index100Value: 1000,

    stage: {
        nb: 5,
        duration: ENUMS.PERIODS.QUARTER
    }
});

var decisions: any;



var robot = machines.robot;

var material = supply.materials[0];

var supplier = supply.suppliers[0];

var rmWarehouse = supply.warehouses[0];

var alphaA = products.alphaA;
var betaA = products.betaA;
var productA = products.productA;

var alphaASubContracter = products.alphaASubContracter;

var alphaB = products.alphaB;
var betaB = products.betaB;
var productB = products.productB;

var alphaBSubContracter = products.alphaBSubContracter;

var alphaC = products.alphaC;
var betaC = products.betaC;
var productC = products.productC;

var alphaCSubContracter = products.alphaCSubContracter;

var atelierMoulage = ateliers[0];
var atelierFinition = ateliers[1];

var machinist = workers.machinist;
var assemblyWorker = workers.assemblyWorker;

var materialMarketPrices;

var alphaAMarketPrice,
    alphaAQualityPremium;

var alphaBMarketPrice,
    alphaBQualityPremium;

var alphaCMarketPrice,
    alphaCQualityPremium;

// TODO fix market conditions
materialMarketPrices = [
    { term: ENUMS.FUTURES.IMMEDIATE, basePrice: 39.252 },
    { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 32.615 },
    { term: ENUMS.FUTURES.SIX_MONTH, basePrice: 29.748 }
];


alphaAMarketPrice = [
    { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 123 },
];

alphaAQualityPremium = [
    { index: ENUMS.QUALITY.HQ, premium: 145/123}
];



alphaBMarketPrice = [
    { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 187 },
];

alphaBQualityPremium = [
    { index: ENUMS.QUALITY.HQ, premium: 232 / 187 }
];



alphaCMarketPrice = [
    { term: ENUMS.FUTURES.THREE_MONTH, basePrice: 290 },
];

alphaCQualityPremium = [
    { index: ENUMS.QUALITY.HQ, premium: 358/290 }
];

// machines
robot.init(11);

// materials
rmWarehouse.init(2708, 239360, 0, 0, 0, 0, 0, 0);

material.init([supplier], rmWarehouse);

// sync suppliers with market new prices
supplier.syncPrices(materialMarketPrices);

// workers
machinist.init(game, 88, 0, {
    shiftLevel: 2,
    hourlyWageRate: 10,

    dismissedNb: 0,
    recruitedNb: 0,
    trainedNb: 0
});

assemblyWorker.init(game, 26, 0, {
    shiftLevel: 1,
    hourlyWageRate: 10,

    dismissedNb: 0,
    recruitedNb: 0,
    trainedNb: 0
});

// ateliers
atelierMoulage.init(machinist, robot);
atelierFinition.init(assemblyWorker, null);

// init products and their semiProducts
alphaA.init(atelierMoulage, material, alphaASubContracter);
betaA.init(atelierFinition, null, null);

productA.init([alphaA, betaA]);

alphaB.init(atelierMoulage, material, alphaBSubContracter);
betaB.init(atelierFinition, null, null);

productB.init([alphaB, betaB]);


alphaC.init(atelierMoulage, material, alphaCSubContracter);
betaC.init(atelierFinition, null, null);

productC.init([alphaC, betaC]);

// sync subContracter with market prices
alphaASubContracter.syncPrices(alphaAMarketPrice, alphaAQualityPremium);
alphaBSubContracter.syncPrices(alphaBMarketPrice, alphaBQualityPremium);
alphaCSubContracter.syncPrices(alphaCMarketPrice, alphaCQualityPremium);



/*
 * Decisions
 */

// machines decisions
robot.buy(0);
robot.sell(0);
robot.doMaintenance(25);
robot.setShiftLevel(ENUMS.SHIFT_LEVEL.DOUBLE);


// materials purchases
supplier.order(10000, ENUMS.QUALITY.MQ, ENUMS.FUTURES.IMMEDIATE);
supplier.order(0, ENUMS.QUALITY.MQ, ENUMS.FUTURES.THREE_MONTH);
supplier.order(0, ENUMS.QUALITY.MQ, ENUMS.FUTURES.SIX_MONTH);

// SubContracting
alphaA.subContract(0, 0.25, ENUMS.FUTURES.THREE_MONTH);
alphaB.subContract(0, 0.25, ENUMS.FUTURES.THREE_MONTH);
alphaC.subContract(0, 0.25, ENUMS.FUTURES.THREE_MONTH);

// Personnel
assemblyWorker.recruit(0);
assemblyWorker.train(0);

assemblyWorker.pay(10);

machinist.pay(10);


productA.manufacture(2600, 50, 0.25, 115, 0);
productB.manufacture(1275, 50, 0.25, 165, 0);
productC.manufacture(750, 50, 0.25, 325, 0);


/*alphaA.manufacture(2693, 50, 0.25);
betaA.manufacture(2693, 115);*/

/*alphaB.manufacture(1323, 50, 0.25);
betaB.manufacture(1323, 165);


alphaC.manufacture(778, 50, 0.25);
betaC.manufacture(778, 325);*/





window.onload = () => {
    var el = document.getElementById('content');


};