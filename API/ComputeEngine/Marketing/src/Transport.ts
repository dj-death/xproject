import Market = require('./Market');


interface TransportParams {
    shipmentDistance: number;
    distanceLimit: number;

    costs: {
        containerDailyHireCost: number;
        containerShipmentCost: number;
        productStorageCost: number;
    }
}



class Transport {
    private initialised: boolean;

    params: TransportParams;

    market: Market;

    constructor(params: TransportParams) {
        this.params = params;
    }

    init(market: Market) {
        this.market = market;

        this.initialised = true;
    }

    totalContainersNb: number = 0;

    get containerDaysNb(): number {
        return Math.ceil(this.journeyLength / this.params.distanceLimit) * this.loadsNb;
    }

    // results
    get loadsNb(): number {
        return Math.ceil(this.totalContainersNb);
    }

    get journeyLength(): number {
        return this.params.shipmentDistance * 2;
    }

    // cost
    get hiredTransportCost(): number {
        var cost = 0;
        cost += this.containerDaysNb * this.params.costs.containerDailyHireCost;
        cost += this.loadsNb * this.params.costs.containerShipmentCost;

        return cost;
    }


    load(containersNb: number) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        this.totalContainersNb += containersNb;
    }
}

export = Transport;