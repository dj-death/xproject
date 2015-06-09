import Supplier = require('./Supplier');
import SemiProduct = require('./SemiProduct');
import ENUMS = require('./ENUMS');



class SubContracter extends Supplier<SemiProduct> {

    // helpers
    _getPrice(quality: ENUMS.QUALITY, term: ENUMS.FUTURES/*, credit: ENUMS.CREDIT*/): number {

        var price: number,
            basePrice = this.params.availableFutures[ENUMS.FUTURES[term]].basePrice,
            qualityPremium: number,

            HQPremium: number,
            MQPremium: number;

        if (ENUMS.QUALITY[quality] !== undefined) {
            qualityPremium = this.params.availableQualities[ENUMS.QUALITY[quality]].premium;

        } else {
            if (ENUMS.QUALITY.MQ < quality && quality < ENUMS.QUALITY.HQ) {

                HQPremium = this.params.availableQualities[ENUMS.QUALITY.HQ].premium;
                MQPremium = this.params.availableQualities[ENUMS.QUALITY.MQ].premium;

                // linear adjustment
                qualityPremium = MQPremium + ((quality - ENUMS.QUALITY.MQ) * (HQPremium - MQPremium)) / (ENUMS.QUALITY.HQ - ENUMS.QUALITY.MQ);
            }
        }

        price = basePrice * (1 + qualityPremium);

        return price;
    }

}

export = SubContracter;