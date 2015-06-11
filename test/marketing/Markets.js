var Market = require('../../API/ComputeEngine/Marketing/src/Market');
module.exports = {
    euroMarket: new Market({
        name: 'Euro Zone',
        /*distribution: {
            shipmentDistance: 717,
            containerDailyHireCost: 650,
            containerShipmentCost: 0,
            distanceLimit: 400,
            productStorageCost: 3.50
        },*/
        acceptBacklog: true,
        dissatisfiedOrdersCancelledPercent: 0.5,
        costs: {
            creditCardRatePerUnitSold: 0,
            creditControlUnitCost: 1
        }
    }),
    naftaMarket: new Market({
        name: 'NAFTA Market',
        /*distribution: {
            shipmentDistance: 250,
            containerDailyHireCost: 650,
            containerShipmentCost: 8000,
            distanceLimit: 400,
            productStorageCost: 4
        },*/
        acceptBacklog: true,
        dissatisfiedOrdersCancelledPercent: 0.5,
        costs: {
            creditCardRatePerUnitSold: 0,
            creditControlUnitCost: 1
        }
    }),
    internetMarket: new Market({
        name: 'Internet',
        /*distribution: {
            shipmentDistance: 150,
            containerDailyHireCost: 650,
            containerShipmentCost: 0,
            distanceLimit: 400,
            productStorageCost: 3.50
        },*/
        acceptBacklog: false,
        dissatisfiedOrdersCancelledPercent: 1,
        costs: {
            creditCardRatePerUnitSold: 1,
            creditControlUnitCost: 0
        }
    })
};
//# sourceMappingURL=Markets.js.map