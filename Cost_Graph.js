// Draw graph from CSV file
function drawCostGraph(Elering_Data, CSV_Data, horizontalWidthBetweenStrokes){
    // Get SVG container width
    const Cost_SVG_Width = document.getElementById("NPS_CSV_Cost").getBoundingClientRect().width;

    // Find elements to work with
    const Cost_Graph = document.getElementById("costGraph");
    const Text_Group = document.getElementById("costText");
    const Base_Graph = document.getElementById("costBaseGraph");
    const Graph_Title = document.getElementById("graphTwoTitle");

    // Clear the contents of SVG before redrawing
    Cost_Graph.innerHTML = "";
    Text_Group.innerHTML = "";
    Base_Graph.innerHTML = "";
    Graph_Title.innerHTML = "";

    // Variables
    const Graph_Offset_From_End = 50; // Defines offset from SVG container end in pixels
    const Horizontal_Graph_End_Position = Cost_SVG_Width - Graph_Offset_From_End; // Defines how far the horisontal graph should go

    // X and Y coordinates for vertical and horizontal graph lines
    const Base_Graph_Coordinates = {
        X : [60, 60, 60, Horizontal_Graph_End_Position, 60, 58, 60, 62, Horizontal_Graph_End_Position, Horizontal_Graph_End_Position-5, Horizontal_Graph_End_Position, Horizontal_Graph_End_Position-5],
        Y : [350, 600, 600, 600, 350, 355, 350, 355, 600, 602, 600, 598]
    };

    // For the sake of it, X and Y are pairs so X and Y arrays are the same length
    const length = Base_Graph_Coordinates.X.length;
    let baseStr = "";
    for (let i = 0; i < length; i+=2) {
        baseStr += `<line x1="${Base_Graph_Coordinates.X[i]}" y1="${Base_Graph_Coordinates.Y[i]}"
                    x2="${Base_Graph_Coordinates.X[i+1]}"y2="${Base_Graph_Coordinates.Y[i+1]}" />`;
    }
    Base_Graph.innerHTML = baseStr;

    // Calculate cost for each hour of spending
    let cost_data = [];
    let eleringData_length = Elering_Data.length - 2;
    for (let i = 0; i < eleringData_length; i++) {
        cost_data.push((Elering_Data[i].price * CSV_Data[i]) / 10); // Divide by 10 because elering data is in MWh, not KWh
    }

    // Find highest and average cost as well as when and what etc
    let highestCost = cost_data[0];
    let averageCost = 0;
    let whenHighestCost = 0;
    let whatElectricityPrice = 0;
    let whatConsumption = 0;
    const costDataLength = cost_data.length;
    for(let i = 0; i < costDataLength; i++) {
        // Highest cost
        if(cost_data[i] >= highestCost) {
            highestCost = cost_data[i];
            whenHighestCost = Elering_Data[i].timestamp * 1000;
            whatElectricityPrice = Elering_Data[i].price / 10; // MWh -> KWh
            whatConsumption = CSV_Data[i];
        }
        // Sum for average cost
        averageCost += cost_data[i];
    }
    averageCost = averageCost/costDataLength;
    const highest_consumption_date = new Date(whenHighestCost).toLocaleString("fi-FI").substring(0, 15);

    // Map cost data to cost graph
    let lineStr = "";
    const cost_ratio = 200 / highestCost;
    let x1 = 61;
    let x2 = 61 + horizontalWidthBetweenStrokes;
    for(let i = 0; i < Elering_Data.length; i++) {
        let y = 600 - cost_data[i] * cost_ratio;
        lineStr += `<line id="cost${cost_data[i]}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2" />`;
        x1 += horizontalWidthBetweenStrokes;
        x2 += horizontalWidthBetweenStrokes;
    }
    Cost_Graph.innerHTML += lineStr;

    Graph_Title.style.fontFamily = "arial";
    Graph_Title.style.fontSize = "16px";
    Graph_Title.innerHTML += `<text x="${(Cost_SVG_Width / 2) - 100}" y="640">Consumption cost graph</text>`;

    document.getElementById("highestCost").innerHTML = `Period highest cost of consumption: ${highestCost.toFixed(3)} \u00A2`;
    document.getElementById("whenCost").innerHTML = `Which was consumed on ${highest_consumption_date} with the electricity price of ${whatElectricityPrice.toFixed(3)} \u00A2/KWh. The consumed electricity was ${whatConsumption} KWh.`;
    document.getElementById("averageCost").innerHTML = `Period average cost of consumption: ${averageCost.toFixed(3)} \u00A2`;
}