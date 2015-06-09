import AbstractObject = require('./AbstractObject');
import SemiProduct = require('./SemiProduct');
import Warehouse = require('./Warehouse');

import Utils = require('../../../../utils/Utils');



interface ProductCosts {
    scrapValue: number;
    guaranteeServicingCharge: number;
    inspectionUnit: number;
    planningUnit: number;
}

interface ProductParams extends AbstractObject {
    spaceNeeded: number;
    label: string;

    CO2Footprint: {
        kwh: number;
        weight: number;
    };

    containerCapacityUnitsNb: number;

    rejectedProbability: number;
    lostProbability: number;

    costs: ProductCosts;
}

class Product {
    private initialised: boolean;

    params: ProductParams;

    private semiProducts: SemiProduct[];

    private warehouse: Warehouse;

   
    constructor(params: ProductParams) {
        this.params = params;
    }

    _calcRejectedUnitsNbOf(quantity: number): number {
        var landa: number,
            probability: number,
            value = 0,
            i = 0;

        probability = Math.random() * this.params.rejectedProbability;

        landa = probability * quantity;

        return Math.round(Utils.getPoisson(landa));
    }

    
    init(semiProducts: SemiProduct[]) {

        this.semiProducts = semiProducts;

        this.warehouse = new Warehouse({
            lostProbability: this.params.lostProbability,

            costs: {
                fixedAdministrativeCost: 0,
                storageUnit: 0
            }
        });

        this.warehouse.init(0);

        // now everything is ok
        this.initialised = true;
    }

    lastManufacturingParams: IArguments;

    // result
    scheduledNb = 0;
    producedNb = 0;

    get availableNb(): number {
        return this.warehouse.availableQ;
    }

    rejectedNb: number = 0;

    get lostNb(): number {
        return this.warehouse.lostQ;
    }

    // actions
    manufacture(quantity: number, ...semiProductsDecisions: number[]): number {
        if (!this.initialised) {
            console.log('not initialised');
            return 0;
        }

        this.lastManufacturingParams = arguments;

        this.scheduledNb += quantity;

        this.rejectedNb += this._calcRejectedUnitsNbOf(quantity);

        quantity += this.rejectedNb;

        var i = 0,
            len = this.semiProducts.length,
            manufacturingUnitTime: number,
            premiumQualityProp: number,

            unitsNb: number,
            result: number[] = [],

            minUnitsNb: number;

        for (; i < len; i++) {
            manufacturingUnitTime = semiProductsDecisions.shift();
            premiumQualityProp = semiProductsDecisions.shift();

            this.semiProducts[i].manufacture(quantity, manufacturingUnitTime, premiumQualityProp);

            unitsNb = this.semiProducts[i].deliverTo(quantity);

            result.push(unitsNb);
        }


        // we sort the results ASC and we take the first as it the min value
        minUnitsNb = result.sort()[0];

        this.producedNb += minUnitsNb;

        // now supply the stock
        this.warehouse.moveIn(this.producedNb - this.lostNb);

        return minUnitsNb;
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
}

export = Product;
