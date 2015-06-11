import AbstractObject = require('./AbstractObject');
import SemiProduct = require('./SemiProduct');
import Warehouse = require('./Warehouse');

import Utils = require('../../../../utils/Utils');

import Market = require('../../Marketing/src/Market');



interface ProductCosts {
    scrapValue: number;
    guaranteeServicingCharge: number;
    inspectionUnit: number;
    planningUnit: number;
}

interface ProductParams extends AbstractObject {
    code: number;

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

    

    // decisions
    lastManufacturingParams: IArguments;

    developmentBudget: number;

    // result
    scheduledNb = 0;
    producedNb = 0;

    get availableNb(): number {
        return this.warehouse.availableQ;
    }

    rejectedNb: number = 0;

    servicedQ: number = 0;

    get lostNb(): number {
        return this.warehouse.lostQ;
    }

    get guaranteeServicingCost(): number {
        return this.servicedQ * this.params.costs.guaranteeServicingCharge;
    }


    // actions
    manufacture(quantity: number, ...semiProductsDecisions: number[]): number {
        if (!this.initialised) {
            console.log('Product not initialised to Manufacture');
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


    deliverTo(quantity: number, market: Market, price: number, advertisingBudget: number): number {
        if (!this.initialised) {
            console.log('Product not initialised');
            return 0;
        }

        var diff: number,
            compensation: number,
            args = [];

        diff = quantity - this.warehouse.availableQ;

        // on peut pas satisfaire la totalité de la demande
        if (diff > 0) {
            args.concat([], this.lastManufacturingParams);
            args[0] = diff;

            compensation = this.manufacture.apply(this, args);

            quantity = this.warehouse.availableQ + compensation;
        }

        this.warehouse.moveOut(quantity);

        market.receiveFrom(quantity, this, price, advertisingBudget);

        return quantity;
    }

    developWithBudget(developmentBudget: number): boolean {
        this.developmentBudget = developmentBudget;


        return true;
    }

    takeUpImprovements(isOk: boolean) {
        if (!isOk) {

        }
    }

    returnForRepair(quantity: number) {
        this.servicedQ += quantity;
    }
}

export = Product;
