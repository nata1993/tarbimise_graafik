class StatisticsBuilder {
    calculateHighestPriceOfElectricity(data) {
        let highestPriceOfElectricity = 0;
        const length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i]["price"] > highestPriceOfElectricity) {
                highestPriceOfElectricity = data[i]["price"];
            }
        }
        this.highestPriceOfElectricity = highestPriceOfElectricity.toFixed(3);
        return this;
    }
    calculateLowestPriceOfElectricity(data) {
        let lowestPriceOfElectricity = data[0].price;
        const length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i]["price"] < lowestPriceOfElectricity) {
                lowestPriceOfElectricity = data[i]["price"];
            }
        }
        this.lowestPriceOfElectricity = lowestPriceOfElectricity.toFixed(3);;
        return this;
    }
    calculateAveragePriceOfElectricity(data) {
        let averagePriceOfElectricity = 0;
        const length = data.length;
        for(let i = 0; i < length; i++) {
            averagePriceOfElectricity += data[i]["price"];
        }
        averagePriceOfElectricity = averagePriceOfElectricity / length;
        this.averagePriceOfElectricity = averagePriceOfElectricity.toFixed(3);;
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
        this.highestConsumption = highestConsumption;
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
        this.lowestConsumption = lowestConsumption;
        return this;
    }
    calculateAverageConsmption(data) {
        let averageConsmption = 0;
        const length = data.length;
        for(let i = 0; i < length; i++){
            averageConsmption += data[i]["consumption"];
        }
        averageConsmption = averageConsmption / length;
        this.averageConsmption = averageConsmption.toFixed(3);
        return this;
    }
    calculateTotalConsumption(data) {
        this.totalConsumption = totalConsumption;
        return this;
    }
    calculateWeightedAveragePriceOfElectricity(data) {
        this.weightedAveragePriceOfElectricity = weightedAveragePriceOfElectricity;
        return this;
    }
    calculateAverageCostOfConsumption(data) {
        this.averageCostOfConsumption = averageCostOfConsumption;
        return this;
    }
    calculateHighestCostOfConsumption(data) {
        this.highestCostOfConsumption = highestCostOfConsumption;
        return this;
    }

    buildStatistics() {
        return new Statistics(
            this.highestPriceOfElectricity,
            this.lowestPriceOfElectricity,
            this.averagePriceOfElectricity,
            this.highestConsumption,
            this.lowestConsumption,
            this.averageConsmption
            );
    }
}