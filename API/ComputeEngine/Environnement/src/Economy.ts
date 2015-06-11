import Demand = require('./Demand');
import Currency = require('./Currency');

interface EconomicsParams {
    name: string;

    population: number;
    initialGDPPerCapita: number;
    internetAccessPercent: number;

    currency: Currency;
}

class Economy {
    private initialised: boolean;
    
    private demand: Demand;

    params: EconomicsParams;

    constructor(params: EconomicsParams) {
        this.params = params;
    }

    init() {
        this.initialised = true;
    }

    // results
    GDP: number;
    unemploymentRate: number;
    externalTradeBalance: number;
    interestBaseRate: number;
    exchangeRate: number;

    businessReport: string;
    

}

export = Economy;