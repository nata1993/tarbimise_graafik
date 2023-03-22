class DataBuilder {
    // Consumption data building from CSV file data
    GetConsumptionDataPeriod(data) {
        this._normalizedConsumptionDataPeriod = data[2][1];
        return this;
    }
    GetDaytimeConsumptionFromData(data){
        this._daytimeConsumptionData = data[6][2].replace(",", ".");
        return this;
    }
    GetNightTimeConsumptionFromData(data){
        this._nighttimeConsumptionData = data[7][2].replace(",", ".");
        return this;
    }
    GetTotalConsumptionFromData(data) {
        this._normalizedConsumptionDataTotalConsumption = data[5][4].replace(",", ".");
        return this;
    }
    NormalizeCSVdata(data) {
        const ignoreDataBeginning = 11;
        let normalizedCSVdataLength = data.length - ignoreDataBeginning;;
        let normalizedCSVdata = [];
        const length = data.length;
        for (let i = ignoreDataBeginning; i < length; i++) {
            normalizedCSVdata.push(Number(data[i][4].replace(",", ".")));
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
        const length = data.length - 2;
        for(let i = 0; i < length; i++) {
            normalizedEleringData.push({
                timestamp : data[i]["timestamp"],
                price : ((data[i]["price"] * 1.2) / 10) // Divide by 10 because MWh -> KWh
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
            let consumption = data2[i];

            if(typeof consumption === "undefined" || consumption === NaN )
            {
                consumption = null;
            }
            else {
                lengthWithoutNull++;
            }

            mergedData.push({
                timestamp : timestamp,
                price : price,
                consumption : consumption
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