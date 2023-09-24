class DataBuilder {
    // Consumption data building from CSV file data
    GetConsumptionDataPeriod(data) {
        this._normalizedConsumptionDataPeriod = data[2][1];
        return this;
    }
    GetDaytimeConsumptionFromData(data){
        let number;
        if (data[6][2] === "" || data[6][2] == null) {
            number = 0;
        }
        else {
            number = data[6][2].replace(",", ".");
        }
        this._daytimeConsumptionData = number;
        return this;
    }
    GetNightTimeConsumptionFromData(data){
        let number;
        if (data[7][2] === "" || data[7][2] == null) {
            number = 0;
        }
        else {
            number = data[7][2].replace(",", ".");
        }
        this._nighttimeConsumptionData = number;
        return this;
    }
    GetTotalConsumptionFromData(data) {
        this._normalizedConsumptionDataTotalConsumption = data[5][4].replace(",", ".");
        return this;
    }
    NormalizeCSVdata(data) {
        const ignoreDataBeginning = 11; // CSV file beginning contains irrelevant data
        let normalizedCSVdataLength = data.length - ignoreDataBeginning;;
        let normalizedCSVdata = [];
        const length = data.length;
        for (let i = ignoreDataBeginning; i < length; i++) {
            const field1 = Number(data[i][4].replace(",", "."));
            const field2 = data[i][2];
            normalizedCSVdata.push({
                consumption : field1,
                consumption_time : field2
            });
        }
        
        this._normalizedConsumptionData = normalizedCSVdata;
        this._normalizedConsumptionDataLength = normalizedCSVdataLength;
        return this;
    }

    BuildConsumptionData() {
        return new ConsumptionData(
            this._normalizedConsumptionData,
            this._normalizedConsumptionDataLength,
            this._normalizedConsumptionDataPeriod,
            this._daytimeConsumptionData,
            this._nighttimeConsumptionData,
            this._normalizedConsumptionDataTotalConsumption
        );
    }

    // Elering electricity price data building
    NormalizeEleringData(data) {
        let normalizedEleringData = [];
        let length;
        let i;
        const date = new Date();
        // Check if current date has daylight savings or not - works only on months where transitition is not happening
        // NB! Temporary solution!
        if(date.getTimezoneOffset() == -180) {
            length = data.length - 3;
            i = 0;
        }
        else {
            length = data.length - 2;
            i = 1;
        }

        for(i; i < length; i++) {
            normalizedEleringData.push({
                timestamp : data[i]["timestamp"],
                price : Number(((data[i]["price"]) / 10).toFixed(2)) // Divide by 10 because MWh -> KWh, 20% tax
            });
        }
        this._normalizedEleringData = normalizedEleringData;
        this._normalizedEleringDataLength = length;
        return this;
    }

    BuildEleringData() {
        return new EleringData(
            this._normalizedEleringData,
            this._normalizedEleringDataLength
        );
    }

    // Building of merged data consisting of Elering electricity price data and consumption data
    MergeData(data1, data2) {
        let mergedData = [];
        let lengthWithoutNull = 0;
        const data1Length = data1.length;
        for(let i = 0; i < data1Length; i++){
            const timestamp = data1[i]["timestamp"]
            const price = data1[i]["price"];
            let consumption = 0;
            let consumption_time = "";
            let cost = null;

            // Fill null for consumption and consumed time after the consumption data ended since
            // electricity prices are day-ahead and consumption is lacking behind in real time data.
            // Since electricity hour price and consumption  are a pair of data at all times, consider it as one
            // hence no need for double check for type.
            if(typeof data2[i] === "undefined" || data2[i] === NaN) {
                consumption = null;
                consumption_time = null;
            }
            else {
                consumption = data2[i].consumption;
                cost = data1[i]["price"] * data2[i]["consumption"];
                consumption_time = data2[i]["consumption_time"];
                lengthWithoutNull++;
            }
            
            mergedData.push({
                timestamp : timestamp,
                price : price,
                consumption : consumption,
                consumption_time : consumption_time,
                cost: cost
            });
        }

        this._mergedDataWithoutNull = lengthWithoutNull;
        this._dataLength = data1Length;
        this._mergedData = mergedData;
        return this;
    }

    BuildMergedData() {
        return new MergedData(
            this._mergedData,
            this._dataLength,
            this._mergedDataWithoutNull
        ); 
    }
}