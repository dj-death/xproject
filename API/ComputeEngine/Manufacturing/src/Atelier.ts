import AbstractObject = require('./AbstractObject');
import Warehouse = require('./Warehouse');
import Worker = require('./Worker');
import Machine = require('./Machine');

interface AtelierCosts {
    power: number;
    fixedExpenses: number;
    maintenance: number;
}

interface AtelierParams extends AbstractObject {
    label: string;
    spaceNeeded: number;

    CO2Footprint: {
        kwh: number;
        weight: number;
    };

    unity: number;
    costs: AtelierCosts;
}

class Atelier {

    private initialised: boolean;
    
    params: AtelierParams;

    constructor(atelierParams: AtelierParams) {
        this.params = atelierParams;
    }

    worker: Worker;
    machine: Machine;

    // results
    workedHoursNb = 0;


    // helper
    init(worker: Worker, machine: Machine) {
        this.worker = worker;
        this.machine = machine;

        // now let's work
        this.initialised = true;
    }


    // actions
    work(hoursNb: number): boolean {
        if (!this.initialised) {
            console.log('not initialised');

            return false;
        }

        var success: boolean;

        // power machines
        success = this.machine && this.machine.power(hoursNb);

        if (!success && this.machine) {
            console.log("Votre demande dépasse la capacité périodique des machines");
            return false;
        }

        // everything is ok now order workers to do their job

        // let's see if the machine do some trouble and need some extra time due to its depreciation
        if (this.machine) {
            hoursNb /= this.machine.machineEfficiencyAvg;
        }

        success = this.worker && this.worker.work(hoursNb);

        if (!success && this.worker) {
            console.log("Votre demande dépasse la capacité périodique des ouvriers");
            return false;
        }

        // now increment
        this.workedHoursNb += hoursNb;

        return success;
    }

}

export = Atelier;