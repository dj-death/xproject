import Currency = require('../../API/ComputeEngine/Environnement/src/Currency');

export = {
    euro: new Currency({
        label: "EURO",
        sign: "€",
        isLocal: true
    }),

    dollar: new Currency({
        label: "USD",
        sign: "$",

        isLocal: false
    })
};



