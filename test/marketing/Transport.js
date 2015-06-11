var Transport = require('../../API/ComputeEngine/Marketing/src/Transport');
module.exports = {
    europeTrs: new Transport({
        shipmentDistance: 717,
        distanceLimit: 400,
        costs: {
            containerDailyHireCost: 650,
            containerShipmentCost: 0,
            productStorageCost: 3.50
        }
    }),
    naftaTrs: new Transport({
        shipmentDistance: 250,
        distanceLimit: 400,
        costs: {
            containerDailyHireCost: 650,
            containerShipmentCost: 8000,
            productStorageCost: 4
        }
    }),
    internetTrs: new Transport({
        shipmentDistance: 150,
        distanceLimit: 400,
        costs: {
            containerDailyHireCost: 650,
            containerShipmentCost: 0,
            productStorageCost: 3.50
        }
    })
};
//# sourceMappingURL=Transport.js.map