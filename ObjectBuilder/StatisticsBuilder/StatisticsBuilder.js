class StatisticsBuilder {
    // Electricity price statistics
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
    calculateWeightedDaytimeAveragePriceOfElectricity(data, length) {
        let daytimeWeightedAveragePriceOfElectricity = 0;
        let weightedTerms = 0;
        let totalOfTerms = 0;
        let counter = 0;
        for(let i = 0; i < length; i++) {
            if (data[i]["consumption_time"] == "Päev") {
                weightedTerms += data[i]["price"] * data[i]["consumption"];
                totalOfTerms += data[i]["consumption"];
                counter++;
            }
        }
        daytimeWeightedAveragePriceOfElectricity = weightedTerms / totalOfTerms;
        this._daytimeWeightedAveragePriceOfElectricity = daytimeWeightedAveragePriceOfElectricity.toFixed(3);
        return this;
    }
    calculateWeightedNighttimeAveragePriceOfElectricity(data, length) {
        let nighttimeWeightedAveragePriceOfElectricity = 0;
        let weightedTerms = 0;
        let totalOfTerms = 0;
        let counter = 0;
        for(let i = 0; i < length; i++) {
            if (data[i]["consumption_time"] == "Öö") {
                weightedTerms += data[i]["price"] * data[i]["consumption"];
                totalOfTerms += data[i]["consumption"];
                counter++;
            }
        }
        nighttimeWeightedAveragePriceOfElectricity = weightedTerms / totalOfTerms;
        this._nighttimeWeightedAveragePriceOfElectricity = nighttimeWeightedAveragePriceOfElectricity.toFixed(3);
        return this; 
    }

    // Electricity consumtion statistics
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
    
    // Electricity cost consumption statistics
    calculateHighestCostOfConsumption(data, length) {
        let highestCostOfConsumption = 0;
        let when = null;
        for(let i = 0; i < length; i++) {
            if(data[i]["cost"] > highestCostOfConsumption) {
                highestCostOfConsumption = data[i]["cost"];
                when = data[i]["timestamp"];
            }
        }

        const date = new Date(when * 1000);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).substr(-2);
        const day = ("0" + date.getDate()).substr(-2);
        const hour = ("0" + date.getHours()).substr(-2);
        const minutes = ("0" + date.getMinutes()).substr(-2);
        const seconds = ("0" + date.getSeconds()).substr(-2);
        const d = day + "." + month + "." + year;
        const t = hour + ":" + minutes + ":" + seconds;

        this._highestCostOfConsumption = highestCostOfConsumption.toFixed(3);
        this._whenHighestCostOfConsumption = d + " " + t;
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
    calculateTotalCostOfConsumption(data, length) {
        let totalCostOfConsumption = 0;
        for(let i = 0; i < length; i++) {
            totalCostOfConsumption += data[i]["cost"];
        }
        totalCostOfConsumption = totalCostOfConsumption / 100; // Convert cents into euro
        this._totalCostOfConsumption = totalCostOfConsumption.toFixed(3);
        return this;
    }

    // Network fees statistics
    calculateTotalNetworkFee () {

    }
    calculateDaytimeNetworkFee () {

    }
    calculateNighttimeNetworkFee () {

    }


    // Build all of the statistics
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
            this._daytimeWeightedAveragePriceOfElectricity,
            this._nighttimeWeightedAveragePriceOfElectricity,
            this._highestCostOfConsumption,
            this._whenHighestCostOfConsumption,
            this._averageCostOfConsumption,
            this._totalCostOfConsumption
        );
    }
}