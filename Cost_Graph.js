// Draw graph from CSV file
function drawCostGraph(Merged_Data, horizontalWidthBetweenStrokes, Length_Without_Null){
    // Find highest and average cost as well as when and what etc
    let highestCost = cost_data[0];
    let averageCost = 0;
    let whenHighestCost = 0;
    let whatElectricityPrice = 0;
    let whatConsumption = 0;
    const costDataLength = cost_data.length;
    for(let i = 0; i < costDataLength; i++) {
        // Highest cost
        if(cost_data[i] > highestCost) {
            highestCost = cost_data[i];
            whenHighestCost = Merged_Data[i]["timestamp"] * 1000; // ms into s
            whatElectricityPrice = Merged_Data[i]["price"];
            whatConsumption = Merged_Data[i]["consumption"];
        }
        // Sum for average cost
        averageCost += cost_data[i];
    }
    highestCost = highestCost.toFixed(3);
    averageCost = (averageCost / costDataLength).toFixed(3);
    const highest_consumption_date = new Date(whenHighestCost).toLocaleDateString("fi-FI");

    document.getElementById("whenCost").innerHTML = `Which was consumed on ${highest_consumption_date} with the electricity price of ${whatElectricityPrice.toFixed(3)} \u00A2/KWh. The consumed electricity was ${whatConsumption} KWh.`;
}