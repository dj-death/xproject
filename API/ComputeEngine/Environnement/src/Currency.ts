interface CurrencyParams {
    label: string;
    sign: string;

    // to see if the base
    isLocal: boolean;
}

class Currency {
    
    private params: CurrencyParams;

    exchangeRate: number = 1;

    constructor(params: CurrencyParams) {
        this.params = params;
    }

    syncExchangeRate(newRate: number) {
        this.exchangeRate = newRate;
    }
}

export = Currency;