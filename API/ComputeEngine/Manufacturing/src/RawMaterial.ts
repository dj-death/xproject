import Supplier = require('./Supplier');
import AbstractObject = require('./AbstractObject');
import Warehouse = require('./Warehouse');
import ENUMS = require('./ENUMS');

interface RawMaterialParams extends AbstractObject {
    spaceNeeded: number;
    label: string;
    CO2Footprint: {
        kwh: number;
        weight: number;
    };

    canUnplannedMaterialPurchases: boolean;
}

class RawMaterial {
    private initialised: boolean;

    params: RawMaterialParams;

    private suppliers: Supplier<RawMaterial>[];
    private warehouse: Warehouse;

    constructor(rawMaterialParams: RawMaterialParams) {
        this.params = rawMaterialParams;
    }

    init(suppliers: Supplier<RawMaterial>[], warehouse: Warehouse) {
        this.suppliers = suppliers;

        // attach suppliers to this rawMateriel
        for (var i = 0, len = suppliers.length; i < len; i++) {
            this.suppliers[i].init(this);
        }

        this.warehouse = warehouse;

        // let's work
        this.initialised = true;
    }

    // actions

    supply(quantity: number, value: number, term: ENUMS.FUTURES): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        return this.warehouse.moveIn(quantity, value, term);
    }
        
    consume(quantity: number, premiumQualityProp: number): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        var deliveredQ: number,
            standardMaterialQ: number;

        standardMaterialQ = quantity * (1 - premiumQualityProp);

        // premium materiel work in JIT
        this.suppliers[0].order(quantity * premiumQualityProp, ENUMS.QUALITY.HQ, ENUMS.FUTURES.IMMEDIATE);

        // normal material from stock
        deliveredQ = this.warehouse.moveOut(standardMaterialQ); 

        if (deliveredQ < standardMaterialQ) {

            if (!this.params.canUnplannedMaterialPurchases) {
                return false;
            }

            this.suppliers[0].order(standardMaterialQ - deliveredQ, ENUMS.QUALITY.MQ, ENUMS.FUTURES.IMMEDIATE, true);
        }

        return true;

    }

}

export = RawMaterial;