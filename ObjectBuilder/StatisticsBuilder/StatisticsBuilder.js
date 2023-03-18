class StatisticsBuilder {
    calculateHighestPriceOfElectricity(data) {
        let highestPriceOfElectricity = 0;
        const length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i]["price"] > highestPriceOfElectricity) {
                highestPriceOfElectricity = data[i]["price"];
            }
        }
        this._highestPriceOfElectricity = highestPriceOfElectricity.toFixed(3);
        return this;
    }
    calculateLowestPriceOfElectricity(data) {
        let lowestPriceOfElectricity = data[0]["price"];
        const length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i]["price"] < lowestPriceOfElectricity) {
                lowestPriceOfElectricity = data[i]["price"];
            }
        }
        this._lowestPriceOfElectricity = lowestPriceOfElectricity.toFixed(3);;
        return this;
    }
    calculateAveragePriceOfElectricity(data) {
        let averagePriceOfElectricity = 0;
        const length = data.length;
        for(let i = 0; i < length; i++) {
            averagePriceOfElectricity += data[i]["price"];
        }
        averagePriceOfElectricity = averagePriceOfElectricity / length;
        this._averagePriceOfElectricity = averagePriceOfElectricity.toFixed(3);;
        return this;
    }
    calculateHighestConsumption(data) {
        let highestConsumption = 0;
        const length = data.length;
        for (let i = 0; i < length; i++) {
            let h = data[i]["consumption"];
            if(h > highestConsumption) {
                highestConsumption = h;
            }
        }
        this._highestConsumption = highestConsumption;
        return this;
    }
    calculateLowestConsumption(data) {
        let lowestConsumption = data[0]["consumption"];
        const length = data.length;
        for (let i = 0; i < length; i++) {
            let m = data[i]["consumption"];
            if( m != null ) {
                if( m <= lowestConsumption ) {
                    lowestConsumption = m;
                }
            }
        }
        this._lowestConsumption = lowestConsumption;
        return this;
    }
    calculateAverageConsmption(data) {
        let averageConsmption = 0;
        const length = data.length;
        for(let i = 0; i < length; i++){
            averageConsmption += data[i]["consumption"];
        }
        averageConsmption = averageConsmption / length;
        this._averageConsmption = averageConsmption.toFixed(3);
        return this;
    }
    calculateWeightedAveragePriceOfElectricity(data, length) {
        let weightedAveragePriceOfElectricity = 0;
        let weightedTerms = 0;
        let totalOfTerms = 0;
        for(let i = 0; i < length; i++) {
            weightedTerms += data[i]["price"] * data[i]["consumption"];
            totalOfTerms += data[i]["consumption"];
        }
        weightedAveragePriceOfElectricity = weightedTerms / totalOfTerms;
        this._weightedAveragePriceOfElectricity = weightedAveragePriceOfElectricity.toFixed(3);
        return this;
    }
    calculateAverageCostOfConsumption(data) {
        this._averageCostOfConsumption = averageCostOfConsumption;
        return this;
    }
    calculateHighestCostOfConsumption(data) {
        this._highestCostOfConsumption = highestCostOfConsumption;
        return this;
    }

    buildStatistics() {
        return new Statistics(
            this._highestPriceOfElectricity,
            this._lowestPriceOfElectricity,
            this._averagePriceOfElectricity,
            this._highestConsumption,
            this._lowestConsumption,
            this._averageConsmption,
            this._weightedAveragePriceOfElectricity
        );
    }
}