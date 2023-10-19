class StatisticsBuilder {
    // Electricity price statistics
    FindHighestPriceOfElectricity(data) {
        let highestPriceOfElectricity = 0;
        const length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i]["price"] > highestPriceOfElectricity) {
                highestPriceOfElectricity = data[i]["price"];
            }
        }
        this._highestPriceOfElectricity = highestPriceOfElectricity.toFixed(2);
        return this;
    }
    FindLowestPriceOfElectricity(data) {
        let lowestPriceOfElectricity = data[0]["price"];
        const length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i]["price"] < lowestPriceOfElectricity) {
                lowestPriceOfElectricity = data[i]["price"];
            }
        }
        this._lowestPriceOfElectricity = lowestPriceOfElectricity.toFixed(2);
        return this;
    }
    CalculateAveragePriceOfElectricity(data) {
        let averagePriceOfElectricity = 0;
        const length = data.length;
        for(let i = 0; i < length; i++) {
            averagePriceOfElectricity += data[i]["price"];
        }
        this._averagePriceOfElectricity = (averagePriceOfElectricity / length).toFixed(2);
        return this;
    }
    CalculateAverageDaytimePriceOfElectricity(data) {
        let average = 0;
        const length = data.length;
        let count = 0;
        for(let i = 0; i < length; i++) {
            if(data[i]["consumption_time"] == "Päev") {
                average += data[i]["price"];
                count++;
            }
        }
        this._averageDaytimePriceOfElectricity = (average / count).toFixed(2);
        return this;
    }
    CalculateAverageNighttimePriceOfElectricity(data) {
        let average = 0;
        const length = data.length;
        let count = 0;
        for(let i = 0; i < length; i++) {
            if(data[i]["consumption_time"] == "Öö") {
                average += data[i]["price"];
                count++;
            }
        }
        this._averageNighttimePriceOfElectricity = (average / count).toFixed(2);
        return this;
    }
    CalculateWeightedAveragePriceOfElectricity(data, length) {
        let weightedTerms = 0;
        let totalOfTerms = 0;
        for(let i = 0; i < length; i++) {
            weightedTerms += data[i]["price"] * data[i]["consumption"];
            totalOfTerms += data[i]["consumption"];
        }
        this._weightedAveragePriceOfElectricity = (weightedTerms / totalOfTerms).toFixed(2);
        return this;
    }
    CalculateWeightedDaytimeAveragePriceOfElectricity(data, length) {
        let weightedTerms = 0;
        let totalOfTerms = 0;
        for(let i = 0; i < length; i++) {
            if (data[i]["consumption_time"] == "Päev") {
                weightedTerms += data[i]["price"] * data[i]["consumption"];
                totalOfTerms += data[i]["consumption"];
            }
        }
        this._daytimeWeightedAveragePriceOfElectricity = (weightedTerms / totalOfTerms).toFixed(2);
        return this;
    }
    CalculateWeightedNighttimeAveragePriceOfElectricity(data, length) {
        let weightedTerms = 0;
        let totalOfTerms = 0;
        for(let i = 0; i < length; i++) {
            if (data[i]["consumption_time"] == "Öö") {
                weightedTerms += data[i]["price"] * data[i]["consumption"];
                totalOfTerms += data[i]["consumption"];
            }
        }
        this._nighttimeWeightedAveragePriceOfElectricity = (weightedTerms / totalOfTerms).toFixed(2);
        return this; 
    }

    // Electricity provider statistics
    CalculateTotalCostOfProviderMargin(margin, totalConsumption ) {
        this._totalMarginCost = ((margin * totalConsumption) / 100).toFixed(2);
        return this;
    }

    // Electricity consumtion statistics
    FindHighestConsumption(data) {
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
    CalculateDayHighestConsumption(data){
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
    FindLowestConsumption(data) {
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
    CalculateAverageConsmption(data) {
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
    CalculateHighestCostOfConsumption(data, length) {
        let highestCostOfConsumption = 0;
        let when = null;
        for(let i = 0; i < length; i++) {
            if(Number(data[i]["cost"]) > highestCostOfConsumption) {
                highestCostOfConsumption = Number(data[i]["cost"]);
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

        this._highestCostOfConsumption = highestCostOfConsumption.toFixed(2);
        this._whenHighestCostOfConsumption = d + " " + t;
        return this;
    }
    CalculateLowestCostOfConsumption(data, length) {
        let lowestCostOfConsumption = Number(data[0]["cost"]);
        let when = null;
        for(let i = 0; i < length; i++) {
            if(Number(data[i]["cost"]) < lowestCostOfConsumption) {
                lowestCostOfConsumption = Number(data[i]["cost"]);
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

        this._lowestCostOfConsumption = lowestCostOfConsumption.toFixed(2);
        this._whenLowestCostOfConsumption = d + " " + t;
        return this;
    }
    CalculateAverageCostOfConsumption(data, length) {
        let sum = 0;
        for(let i = 0; i < length; i++) {
            sum += data[i]["cost"];
        }
        let averageCostOfConsumption = sum / length;
        this._averageCostOfConsumption = averageCostOfConsumption.toFixed(2);
        return this;
    }
    CalculateTotalCostOfConsumption(data, length) {
        let totalCostOfConsumption = 0;
        for(let i = 0; i < length; i++) {
            totalCostOfConsumption += data[i]["cost"];
        }
        totalCostOfConsumption = totalCostOfConsumption / 100; // Convert cents into euro
        this._totalCostOfConsumption = Number(totalCostOfConsumption.toFixed(2));
        return this;
    }

    // Network fees statistics
    CalculateDaytimeNetworkFee(data, length, tarrifs) {
        let totalDaytimeNetworkFee = 0;

        for(let i = 0; i < length; i++) {
            if(data[i]["consumption_time"] == "Päev") {
                totalDaytimeNetworkFee += data[i]["consumption"] * tarrifs[0];
            }
        }

        this._totalDaytimeNetworkFee = Number((totalDaytimeNetworkFee / 100).toFixed(2));
        return this;
    }
    CalculateNighttimeNetworkFee(data, length, tarrifs) {
        let totalNighttimeNetworkFee = 0;

        for(let i = 0; i < length; i++) {
            if(data[i]["consumption_time"] == "Öö") {
                totalNighttimeNetworkFee += data[i]["consumption"] * tarrifs[1];
            }
        }

        this._totalNightimeNetworkFee = Number((totalNighttimeNetworkFee / 100).toFixed(2));
        return this;
    }
    CalculateTotalExcise(data, length, tarrifs) {
        let totalExcise = 0;
        for(let i = 0; i < length; i++) {
            totalExcise += data[i]["consumption"] * tarrifs[2];
        }

        this._totalExcise = Number((totalExcise / 100).toFixed(2));
        return this;
    }
    CalculateTotalRenewableEnergyFee(data, length, tarrifs) {
        let totalRenewableEnergyFee = 0;
        for(let i = 0; i < length; i++) {
            totalRenewableEnergyFee += data[i]["consumption"] * tarrifs[3];
        }

        this._totalRenewableEnergyFee = Number((totalRenewableEnergyFee / 100).toFixed(2));
        return this;
    }
    CalculateTotalNetworkFee() {
        this._totalNetworkFee = Number((this._totalExcise + this._totalRenewableEnergyFee + this._totalDaytimeNetworkFee + this._totalNightimeNetworkFee).toFixed(2));
        return this;
    }

    // Total fees
    CalculateTotalFees() {
        this._totalFees = (this._totalNetworkFee + this._totalCostOfConsumption).toFixed(2);
        return this;
    }

    // Build all of the statistics
    BuildStatistics() {
        return new Statistics(
            // Electricity
            this._highestPriceOfElectricity,
            this._lowestPriceOfElectricity,
            this._averagePriceOfElectricity,
            this._averageDaytimePriceOfElectricity,
            this._averageNighttimePriceOfElectricity,
            this._weightedAveragePriceOfElectricity,
            this._daytimeWeightedAveragePriceOfElectricity,
            this._nighttimeWeightedAveragePriceOfElectricity,
            // Margin
            this._totalMarginCost,
            // Consumption
            this._highestConsumption,
            this._highestDayConsumption,
            this._lowestConsumption,
            this._averageConsmption,
            // Cost
            this._highestCostOfConsumption,
            this._whenHighestCostOfConsumption,
            this._lowestCostOfConsumption,
            this._whenLowestCostOfConsumption,
            this._averageCostOfConsumption,
            this._totalCostOfConsumption,
            // Network fees
            this._totalDaytimeNetworkFee,
            this._totalNightimeNetworkFee,
            this._totalExcise,
            this._totalRenewableEnergyFee,
            this._totalNetworkFee,
            // Total fees
            this._totalFees
        );
    }
}