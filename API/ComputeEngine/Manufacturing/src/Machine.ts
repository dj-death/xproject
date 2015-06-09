import AbstractObject = require('./AbstractObject');
import ENUMS = require('./ENUMS');
import Utils = require('../../../../utils/Utils');


interface MachineCosts {
    maintenanceHourlyCost: number;
    overContractedMaintenanceHourlyCost: number;
    decommissioning: number;
    overheads: number;
    runningHour: number;
}

interface MachineParams extends AbstractObject {

    label: string;
    spaceNeeded: number;
    
    CO2Footprint: ENUMS.CO2Footprint;

    costs: MachineCosts;


    deliveryTime: ENUMS.DELIVERY;
    decommissioningTime: ENUMS.DELIVERY;

    depreciationRate: number;
    usefulLife: number;
    residualValue: number;
    
    breakdownProba: number;
    disposalPrice: number;
    acquisitionPrice: number;

    machineCapacityByShift: number[];
    machineOperatorsNeededNb: number[];
}
 
class Machine  {
    private initialised: boolean;

    // params

    params: MachineParams;

    constructor(machineParams: MachineParams) {
        this.params = machineParams;
    }

    shiftLevel: ENUMS.SHIFT_LEVEL;

    // results
    usedNb: number;
    availablesNextPeriodNb: number;
    boughtNb: number;
    soldNb: number;
    workedHoursNb: number;

    maintenancePlannedHoursNb: number;
    breakdownHoursNb: number;
    maintenanceOverContractedHoursNb: number;

    machineEfficiencyAvg: number;
    machineCapacity: number;
    operatorsNb: number;

    
    // costs
    get runningCost(): number {
        return this.params.costs.runningHour * this.workedHoursNb;
    }

    get overheadsCost(): number {
        return this.params.costs.overheads * this.usedNb;
    }

    get decommissioningCost(): number {
        return this.params.costs.decommissioning * this.soldNb;
    }

    get maintenanceCost(): number {
        var cost: number;

        cost = this.maintenancePlannedHoursNb * this.params.costs.maintenanceHourlyCost;
        cost += this.maintenanceOverContractedHoursNb * this.params.costs.overContractedMaintenanceHourlyCost;

        return cost;
    }

    get CO2FootprintResult(): ENUMS.CO2Footprint {
        var result: ENUMS.CO2Footprint;

        result.kwh = this.workedHoursNb * this.params.CO2Footprint.kwh;
        result.weight = this.workedHoursNb * this.params.CO2Footprint.weight;

        return result;
    }

    // TODO: fix it
    get depreciation(): number {
        return this.params.depreciationRate * this.params.acquisitionPrice * this.usedNb;
    }
    
   


    get theoreticalAvailableHoursNb(): number {
        return (this.usedNb * this.machineCapacity);
    }

    get effectiveAvailableHoursNb(): number {
        var value;

        value = this.theoreticalAvailableHoursNb - this.maintenancePlannedHoursNb - this.maintenanceOverContractedHoursNb;

        // check negative value and correct to 0
        value = value > 0 ? value : 0;

        return value;
    }

    // helper

    _getBreakdownHoursNb(): number {
        var landa = (this.params.breakdownProba / 100) * this.machineCapacity,
            value = 0,
            i = 0;

        for (; i < this.usedNb; i++) {
            value += Utils.getPoisson(landa);
        }

        return value;
    }

    // TODO: implement a mechanism
    _calcMachineEfficiencyAvg(): number {
        return 0.9474;
    }

    init(availablesMachinesNb: number) {
        this.usedNb = availablesMachinesNb;
        this.availablesNextPeriodNb = this.usedNb;

        this.machineEfficiencyAvg = this._calcMachineEfficiencyAvg();
        
        // now you can power machines
        this.initialised = true;

        this.workedHoursNb = 0;
    }


    // Actions

    setShiftLevel(shiftLevel: ENUMS.SHIFT_LEVEL) {
        this.shiftLevel = shiftLevel;

        this.machineCapacity = this.params.machineCapacityByShift[shiftLevel];

        this.operatorsNb = this.params.machineOperatorsNeededNb[shiftLevel] * this.usedNb;

        this.breakdownHoursNb = this._getBreakdownHoursNb();

        this.repair(this.breakdownHoursNb);
    }

    power(hoursNb: number): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        var succes = true,
            effectiveTime: number;

        effectiveTime = hoursNb / this.machineEfficiencyAvg;

        this.workedHoursNb += effectiveTime;

        // sorry we have limited capacity
        if (this.workedHoursNb > this.effectiveAvailableHoursNb) {
            this.workedHoursNb -= effectiveTime;

            succes = false;
        }

        return succes;
    }


    buy(units: number): number {
        var operationValue: number;

        operationValue = units * this.params.acquisitionPrice;

        this.boughtNb = units;

        if (this.params.deliveryTime = ENUMS.DELIVERY.IMMEDIATE) {
            this.usedNb += this.boughtNb;
        }

        this.availablesNextPeriodNb += this.boughtNb;

        return operationValue;
    }

    sell(units: number): number {
        var operationValue: number;

        operationValue = units * this.params.disposalPrice;

        this.soldNb = units;

        if (this.params.decommissioningTime = ENUMS.DELIVERY.IMMEDIATE) {
            this.usedNb -= this.soldNb;
        }

        this.availablesNextPeriodNb -= this.soldNb;

        return operationValue;
    }

    repair(breakdownHoursNb: number): boolean {
        this.maintenanceOverContractedHoursNb = breakdownHoursNb - this.maintenancePlannedHoursNb;

        if (this.maintenanceOverContractedHoursNb < 0) {
            this.maintenanceOverContractedHoursNb = 0;
        }

        return true;
    }

    doMaintenance(hoursByMachineNb: number): boolean {

        var operationValue: number;

        this.maintenancePlannedHoursNb = hoursByMachineNb * this.usedNb;

        return true;
    }
}

export = Machine;