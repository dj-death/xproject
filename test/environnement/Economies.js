var Economy = require('../../API/ComputeEngine/Environnement/src/Economy');
var Currency = require('../../API/ComputeEngine/Environnement/src/Currency');
var euro = new Currency({
    label: "EURO",
    sign: "€",
    isLocal: true
});
var dollar = new Currency({
    label: "USD",
    sign: "$",
    isLocal: false
});
module.exports = {
    europe: new Economy({
        name: "European Union (EU)",
        currency: euro,
        initialGDPPerCapita: 34222,
        population: 501000000,
        internetAccessPercent: 0.673
    }),
    northAmerica: new Economy({
        name: "North American free trade area (Nafta)",
        currency: dollar,
        initialGDPPerCapita: 37315,
        population: 453000000,
        internetAccessPercent: 0.657
    }),
    restOfDevelopedWorld: new Economy({
        name: "Other major economies",
        currency: dollar,
        initialGDPPerCapita: 5390,
        population: 3504000000,
        internetAccessPercent: 0.238
    }),
    world: new Economy({
        name: "World",
        currency: dollar,
        initialGDPPerCapita: 11874,
        population: 5000000000,
        internetAccessPercent: 0.238
    })
};
//# sourceMappingURL=Economies.js.map