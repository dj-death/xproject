var Currency = require('../../API/ComputeEngine/Environnement/src/Currency');
module.exports = {
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
//# sourceMappingURL=Currencies.js.map