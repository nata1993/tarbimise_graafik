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
    calculateDayHighestConsumption(data){
        let highestDay = 0;
        let temp = 0;
        let counter = 0;
        let array = [];
        const length = data.length;

        // calculate each day total consumption
        for(let i = 0; i < length; i++) {
            if (counter < 24) {
                temp += data[i]["consumption"];
                counter++;
            }
            else {
                array.push(temp);
                counter = 0;
                temp = 0;
            }
        }
        highestDay = array[0];

        // find highest day
        const arrayLength = array.length;
        for(let i = 1; i < arrayLength; i++){
            if(array[i] >= highestDay) {
                highestDay = array[i];
            }
        }

        this._highestDayConsumption = highestDay.toFixed(3);
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
    calculateHighestCostOfConsumption(data, length) {
        let highestCostOfConsumption = 0;
        for(let i = 0; i < length; i++) {
            if(data[i]["cost"] > highestCostOfConsumption) {
                highestCostOfConsumption = data[i]["cost"];
            }
        }
        this._highestCostOfConsumption = highestCostOfConsumption.toFixed(3);
        return this;
    }
    calculateAverageCostOfConsumption(data, length) {
        let sum = 0;
        for(let i = 0; i < length; i++) {
            sum += data[i]["cost"];
        }
        let averageCostOfConsumption = sum / length;
        this._averageCostOfConsumption = averageCostOfConsumption.toFixed(3);
        return this;
    }

    buildStatistics() {
        return new Statistics(
            this._highestPriceOfElectricity,
            this._lowestPriceOfElectricity,
            this._averagePriceOfElectricity,
            this._highestConsumption,
            this._highestDayConsumption,
            this._lowestConsumption,
            this._averageConsmption,
            this._weightedAveragePriceOfElectricity,
            this._highestCostOfConsumption,
            this._averageCostOfConsumption
        );
    }
}