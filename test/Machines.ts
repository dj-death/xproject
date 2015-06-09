import Machine = require('../API/ComputeEngine/Manufacturing/src/Machine');
import ENUMS = require('../API/ComputeEngine/Manufacturing/src/ENUMS');


export = {
    robot: new Machine({
        label: "Robot",

        spaceNeeded: 25,

        CO2Footprint: {
            kwh: 6,
            weight: 3.12
        },

        costs: {
            decommissioning: 60000,
            maintenanceHourlyCost: 85,
            overContractedMaintenanceHourlyCost: 175,
            overheads: 3500,
            runningHour: 8
        },

        acquisitionPrice: 300000,
        disposalPrice: 150000,


        deliveryTime: ENUMS.DELIVERY.NEXT_PERIOD,
        decommissioningTime: ENUMS.DELIVERY.NEXT_PERIOD,

        depreciationRate: 0.025,
        usefulLife: 20,
        residualValue: 0,

        machineCapacityByShift: [576, 1068, 1602],
        machineOperatorsNeededNb: [4, 8, 12],

        breakdownProba: 0.35 // %
    
    })
};