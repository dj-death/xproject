import AbstractObject = require('./AbstractObject');
import RawMaterial = require('./RawMaterial');
import Warehouse = require('./Warehouse');
import SubContracter = require('./SubContracter');

import ENUMS = require('./ENUMS');

import Atelier = require('./Atelier');

import Utils = require('../../../../utils/Utils');

interface RawMaterialConsumptionCfg {
    rawMaterial?: RawMaterial;
    consoUnit: number;
}

interface ManufacturingCfg {
    atelier?: Atelier;
    minManufacturingUnitTime: number;
}

interface SemiProductParams extends AbstractObject {
    // params
    spaceNeeded: number;
    label: string;
    CO2Footprint: {
        kwh: number;
        weight: number;
    };

    lostProbability: number;
    rejectedProbability: number;

    costs: {
        inspectionUnit: number;
        planningUnit: number;
    }

    rawMaterialConsoCfg: RawMaterialConsumptionCfg;
    manufacturingCfg: ManufacturingCfg;
}

class SemiProduct {

    private initialised: boolean;

    params: SemiProductParams;

    manufacturingUnitTime: number;

    private warehouse: Warehouse;

    private subContracter: SubContracter;

    constructor(semiProductParams: SemiProductParams) {
        this.params = semiProductParams;
    }

    init(atelier: Atelier, rawMaterial: RawMaterial, subContracter: SubContracter) {
        this.params.manufacturingCfg.atelier = atelier;
        this.params.rawMaterialConsoCfg.rawMaterial = rawMaterial;

        this.subContracter = subContracter;

        // init it by the semiProduct
        this.subContracter && this.subContracter.init(this);

        this.warehouse = new Warehouse({
            lostProbability: this.params.lostProbability,

            costs: {
                fixedAdministrativeCost: 0,
                storageUnit: 0
            }
        });

        this.warehouse.init(0);

        // now it's ok
        this.initialised = true;
    }


    // helpers
    _calcRejectedUnitsNbOf(quantity: number): number {
        var landa: number,
            probability: number,
            value = 0,
            i = 0;

        probability = Math.random() * this.params.rejectedProbability;

        landa = probability * quantity;

        return Math.round(Utils.getPoisson(landa));
    }

    lastManufacturingParams: IArguments;

    // results
    producedNb = 0;
    scheduledNb = 0;

    get availableNb(): number {
        return this.warehouse.availableQ;
    }

    rejectedNb: number = 0;

    get lostNb(): number {
        return this.warehouse.lostQ;
    }

    get rawMaterialTotalConsoQ(): number {
        return this.producedNb * this.params.rawMaterialConsoCfg.consoUnit;
    }

    get manufacturingTotalHoursNb(): number {
        return this.producedNb * this.manufacturingUnitTime / 60;
    }


    // actions
    manufacture(quantity: number, manufacturingUnitTime: number, premiumQualityProp: number = 0): number {
        if (!this.initialised) {
            console.log('not initialised');
            return 0;
        }

        this.lastManufacturingParams = arguments;

        var mCfg = this.params.manufacturingCfg,
            rmCfg = this.params.rawMaterialConsoCfg,
            consoUnit = rmCfg.consoUnit,

            i = 0,
            done: boolean;

        this.scheduledNb += quantity;

        manufacturingUnitTime = manufacturingUnitTime < mCfg.minManufacturingUnitTime ? mCfg.minManufacturingUnitTime : manufacturingUnitTime;

        this.manufacturingUnitTime = manufacturingUnitTime;

        for (; i < quantity; i++) {
            done = mCfg.atelier && mCfg.atelier.work(manufacturingUnitTime / 60);
            
            if (!done && mCfg.atelier) {
                --i;
                break;
            }

            done = rmCfg.rawMaterial && rmCfg.rawMaterial.consume(consoUnit, premiumQualityProp);
            
            // if we have materiel but we didn'h have sufficient quantity then break;
            if (!done && rmCfg.rawMaterial) {
                --i;
                break;
            }
        }

        this.producedNb += i;

        this.warehouse.moveIn(i);

        return i;

    }

    deliverTo(quantity: number): number {
        var diff: number,
            compensation: number,
            args = [];
        
        diff = quantity - this.warehouse.availableQ;

        if (diff < 0) {
            args.concat(this.lastManufacturingParams);
            args[0] = diff;

            compensation = this.manufacture.call(args);
             
            quantity = this.warehouse.availableQ + compensation;
        }

        return quantity;
    }

    subContract(unitsNb: number, premiumQualityProp: number = 0, term: ENUMS.FUTURES = ENUMS.FUTURES.IMMEDIATE): boolean {
        var qualityIdx: number;

        qualityIdx = ENUMS.QUALITY.HQ * premiumQualityProp + ENUMS.QUALITY.MQ;

        this.subContracter.order(unitsNb, qualityIdx, term);

        return this.supply(unitsNb);
    }

    supply(quantity: number, value: number = 0, term: ENUMS.FUTURES = ENUMS.FUTURES.IMMEDIATE): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        return this.warehouse.moveIn(quantity, value, term);
    }

}

export = SemiProduct;