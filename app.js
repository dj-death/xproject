var game = require('./test/Game');
var ENUMS = require('./API/ComputeEngine/Manufacturing/src/ENUMS');
var machines = require('./test/manufacturing/Machines');
var supply = require('./test/manufacturing/Supply');
var products = require('./test/manufacturing/Products');
var ateliers = require('./test/manufacturing/Ateliers');
var workers = require('./test/manufacturing/Workers');
var markets = require('./test/marketing/Markets');
var salesForce = require('./test/marketing/SalesForce');
var economies = require('./test/environnement/Economies');
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
var alphaAMarketPrice, alphaAQualityPremium;
var alphaBMarketPrice, alphaBQualityPremium;
var alphaCMarketPrice, alphaCQualityPremium;
var euroMarket = markets.euroMarket, naftaMarket = markets.naftaMarket, internetMarket = markets.internetMarket;
var euroAgents = salesForce.euroAgents, naftaDistributors = salesForce.naftaDistributors, internetDistributor = salesForce.internetDistributor;
var europe = economies.europe, northAmerica = economies.northAmerica, restOfDevelopedWorld = economies.restOfDevelopedWorld, world = economies.world;
var exchangeRateEurosPerDollar;
// init the game
game.init();
// init economics
europe.init();
northAmerica.init();
restOfDevelopedWorld.init();
world.init();
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
    { index: ENUMS.QUALITY.HQ, premium: 145 / 123 }
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
    { index: ENUMS.QUALITY.HQ, premium: 358 / 290 }
];
// currencies
/*euro.syncExchangeRate(1); // 1 as it is the currency of all operations
dollar.syncExchangeRate(exchangeRateEurosPerDollar);
*/
// machines
robot.init(11);
// materials
rmWarehouse.init(2708, 239360, 0, 0, 0, 0, 0, 0);
material.init([supplier], rmWarehouse);
// sync suppliers with market new prices
supplier.syncPrices(materialMarketPrices);
// workers
machinist.init(88, 0, {
    shiftLevel: 2,
    hourlyWageRate: 10,
    dismissedNb: 0,
    recruitedNb: 0,
    trainedNb: 0
});
assemblyWorker.init(26, 0, {
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
// init agents
euroAgents.init(2);
naftaDistributors.init(3);
internetDistributor.init(1);
// init markets
euroMarket.init(europe, [productA, productB, productC], euroAgents, [0, 0, 0], [6, 7, 0]);
naftaMarket.init(northAmerica, [productA, productB, productC], naftaDistributors, [0, 0, 0], [16, 0, 11]);
internetMarket.init(world, [productA, productB, productC], internetDistributor, [0, 0, 0]);
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
// corporate
euroMarket.setCorporateCom(30000);
naftaMarket.setCorporateCom(30000);
internetMarket.setCorporateCom(38000);
// sales agent
euroAgents.appoint(2, 13000, 0.13);
naftaDistributors.appoint(3, 13000, 0.13);
internetDistributor.appoint(1, 11000, 0.11);
// deliveries to markets + prices + ads
productA.deliverTo(600, euroMarket, 380, 30000);
productA.deliverTo(900, naftaMarket, 380, 30000);
productA.deliverTo(1100, internetMarket, 350, 30000);
productB.deliverTo(300, euroMarket, 660, 30000);
productB.deliverTo(400, naftaMarket, 660, 30000);
productB.deliverTo(575, internetMarket, 600, 30000);
productC.deliverTo(200, euroMarket, 960, 30000);
productC.deliverTo(250, naftaMarket, 960, 30000);
productC.deliverTo(300, internetMarket, 900, 30000);
// R&D
productA.developWithBudget(30000);
productA.takeUpImprovements(true);
productB.developWithBudget(30000);
productB.takeUpImprovements(true);
productC.developWithBudget(30000);
productC.takeUpImprovements(true);
// intelligence
/*
 * Extra / for test purpose
 */
euroMarket.__simulate([594, 293, 194]);
naftaMarket.__simulate([884, 405, 239]);
internetMarket.__simulate([1074, 573, 287]);
window.onload = function () {
    var el = document.getElementById('content');
};
//# sourceMappingURL=app.js.map