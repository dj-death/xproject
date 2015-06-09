import AbstractObject = require('./AbstractObject');
import Atelier = require('./Atelier');

class Factory implements AbstractObject {
    label: string;
    CO2Footprint: {
        kwh: number;
        weight: number;
    };

    costs: any;

    ateliers: Atelier[];

    // params

    static maxLandUse: number;
    static maxFactorySpaceUse: number;
    static fixedExpenses: number;

    // results

    get spaceNeeded(): number {
        return 0;
    }


    // actions

    produce() {

    }

    extendSpace(extension: number) {

    }

}

export = Factory;