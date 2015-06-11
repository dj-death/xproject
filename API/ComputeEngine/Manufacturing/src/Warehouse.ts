import AbstractObject = require('./AbstractObject');
import ENUMS = require('./ENUMS');

import Utils = require('../../../../utils/Utils');

interface WarehouseParams {
    lostProbability: number;

    costs: {
        storageUnit: number;
        fixedAdministrativeCost: number;
    }
}

class Warehouse {
    protected initialised: boolean;

    params: WarehouseParams;

    constructor(warehouseParams: WarehouseParams) {
        this.params = warehouseParams;
    }

    // TODO: implement
    _calcMaterialLostUnitsOfThis(quantity: number): number {
        var lostQ: number,
            probability: number,
            landa: number;

        // based on ??,,
        probability = this.params.lostProbability * Math.random();

        landa = probability * quantity;
        lostQ = Math.round(Utils.getPoisson(landa));


        // reduce the quantity of stock
        if (this.availableQ < lostQ) {
            lostQ = this.availableQ;
        }

        this.availableQ -= lostQ;

        return lostQ;
    }

    init(openingQ: number, openingValue: number = 0,
                                                lastPCommand3MthQ: number = 0, lastPCommand3MthValue: number = 0,
                                                lastPCommand6MthQ: number = 0, lastPCommand6MthValue: number = 0,
                                                beforeLastPCommand6MthQ: number = 0, beforeLastPCommand6MthValue: number = 0) {

        this.openingQ = openingQ;
        this.openingValue = openingValue;

        this.availableQ = openingQ;

        // let's begin
        this.initialised = true;


        // calc the lostQ and by the way diminuish the stock with loss
        this.lostQ = this._calcMaterialLostUnitsOfThis(this.openingQ);


        // the delivery from the last period comes so add it
        this.presentDeliveryBoughtLastPQ = lastPCommand3MthQ;
        this.presentDeliveryBoughtLastPValue = lastPCommand3MthValue;

        this.moveIn(this.presentDeliveryBoughtLastPQ, this.presentDeliveryBoughtLastPValue, ENUMS.FUTURES.IMMEDIATE);

        // the delivery from before last period comes so add it
        this.presentDeliveryBoughtBeforeLastPQ = beforeLastPCommand6MthQ;
        this.presentDeliveryBoughtBeforeLastPValue = beforeLastPCommand6MthValue;

        this.moveIn(this.presentDeliveryBoughtBeforeLastPQ, this.presentDeliveryBoughtBeforeLastPValue, ENUMS.FUTURES.IMMEDIATE);

        this.deliveryNextPQ = lastPCommand6MthQ;
        this.deliveryNextPValue = lastPCommand6MthValue;

    }

    // result
    availableQ;

    openingQ;
    openingValue;

    outQ = 0;

    inQ = 0;
    inValue = 0;

    waitNextPeriodQ = 0;
    waitAfterNextPeriodQ = 0;

    presentDeliveryBoughtLastPQ: number;
    presentDeliveryBoughtLastPValue: number;

    presentDeliveryBoughtBeforeLastPQ: number;
    presentDeliveryBoughtBeforeLastPValue: number;

    deliveryNextPQ: number;
    deliveryNextPValue: number;

    deliveryAfterNextPQ = 0;
    deliveryAfterNextPValue = 0;

    // rupture de stock
    shortfallQ = 0;

    lostQ = 0;

    get closingQ(): number {
        return this.openingQ + this.inQ - this.outQ;
    }

    get unitValue(): number {
        var cmup = (this.openingValue + this.inValue) / (this.openingQ + this.inQ);

        return cmup;
    }

    get endingValue(): number {
        return this.closingQ * this.unitValue;
    }

    get averageStock(): number {
        return (this.openingValue + this.endingValue) * 0.5;
    }

    get storageCost(): number {
        return this.closingQ * this.params.costs.storageUnit;
    }

    get administrativeCost(): number {
        return this.params.costs.fixedAdministrativeCost;
    }


    // actions
    moveOut(quantity): number { // the returned value it's what we could give u
        if (!this.initialised) {
            console.log('not initialised');
            return 0;
        }

        if (this.availableQ < quantity) {
            console.log('il ne reste rien dans le stock');

            this.shortfallQ += (quantity - this.availableQ);

            return this.availableQ;
        }

        this.outQ += quantity;
        this.availableQ -= quantity;

        // we responde 100 % of your quantity requested
        return quantity;
    }

    moveIn(quantity: number, value: number = 0, term: ENUMS.FUTURES = ENUMS.FUTURES.IMMEDIATE): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        switch (term) {
            case ENUMS.FUTURES.IMMEDIATE:
                this.inQ += quantity;
                this.availableQ += quantity;

                this.inValue += value;

                this.lostQ += this._calcMaterialLostUnitsOfThis(this.inValue);

                break;

            case ENUMS.FUTURES.THREE_MONTH:
                this.deliveryNextPQ += quantity;
                this.deliveryNextPValue += value;

                break;

            case ENUMS.FUTURES.SIX_MONTH:
                this.deliveryAfterNextPQ += quantity;
                this.deliveryAfterNextPValue += value;

                break;
        }

        return true;
    }

}

export = Warehouse;