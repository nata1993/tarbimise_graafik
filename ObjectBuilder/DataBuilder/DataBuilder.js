class DataBuilder {
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

    // Consumption data building from CSV file data
    SetConsumptionDataPeriod(data) {
        this._normalizedConsumptionDataPeriod = data[2][1];
        return this;
    }
    SetTotalConsumptionFromData(data) {
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
            this._normalizedConsumptionDataTotalConsumption
        );
    }

    // Building of merged data consisting of Elering electricity price data and consumption data
    MergeData(data1, data2) {
        
        

        const dataLength = data1.length;

        this._dataLength = dataLength;
        this._mergedData = mergedData;
        return this;
    }

    BuildMergedData() {
        return new MergedData(
            this._mergedData,
            this._dataLength
        ); 
    }
}