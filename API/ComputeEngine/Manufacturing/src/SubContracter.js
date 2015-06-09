var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Supplier = require('./Supplier');
var ENUMS = require('./ENUMS');
var SubContracter = (function (_super) {
    __extends(SubContracter, _super);
    function SubContracter() {
        _super.apply(this, arguments);
    }
    // helpers
    SubContracter.prototype._getPrice = function (quality, term /*, credit: ENUMS.CREDIT*/) {
        var price, basePrice = this.params.availableFutures[ENUMS.FUTURES[term]].basePrice, qualityPremium, HQPremium, MQPremium;
        if (ENUMS.QUALITY[quality] !== undefined) {
            qualityPremium = this.params.availableQualities[ENUMS.QUALITY[quality]].premium;
        }
        else {
            if (ENUMS.QUALITY.MQ < quality && quality < ENUMS.QUALITY.HQ) {
                HQPremium = this.params.availableQualities[ENUMS.QUALITY.HQ].premium;
                MQPremium = this.params.availableQualities[ENUMS.QUALITY.MQ].premium;
                // linear adjustment
                qualityPremium = MQPremium + ((quality - ENUMS.QUALITY.MQ) * (HQPremium - MQPremium)) / (ENUMS.QUALITY.HQ - ENUMS.QUALITY.MQ);
            }
        }
        price = basePrice * (1 + qualityPremium);
        return price;
    };
    return SubContracter;
})(Supplier);
module.exports = SubContracter;
//# sourceMappingURL=SubContracter.js.map