// Draw graph from CSV file
function drawCostGraph(Elering_Data, CSV_Data, horizontalWidthBetweenStrokes){
    // Get SVG container width
    const Cost_SVG_Width = document.getElementById("cost").getBoundingClientRect().width;

    // Find elements to work with
    const Cost_Graph = document.getElementById("costGraph");
    const Text_Group = document.getElementById("costText");
    const Base_Graph = document.getElementById("costBaseGraph");

    // Clear the contents of SVG before redrawing
    Cost_Graph.innerHTML = "";
    Text_Group.innerHTML = "";
    Base_Graph.innerHTML = "";

    // Variables
    const Graph_Offset_From_End = 50; // Defines offset from SVG container end in pixels
    const Horizontal_Graph_End_Position = Cost_SVG_Width - Graph_Offset_From_End; // Defines how far the horisontal graph should go
    const Horizontal_Graph_End_Position_Of_Strokes = Horizontal_Graph_End_Position - 86; // Defines how far the strokes on horisontal graph should go

    // X and Y coordinates for vertical and horizontal graph lines
    const Base_Graph_Coordinates = {
        X : [60, 60, 60, Horizontal_Graph_End_Position, 60, 58, 60, 62, Horizontal_Graph_End_Position, Horizontal_Graph_End_Position-5, Horizontal_Graph_End_Position, Horizontal_Graph_End_Position-5],
        Y : [25, 200, 200, 200, 20, 25, 20, 25, 200, 202, 200, 198]
    };

    // For the sake of it, X and Y are pairs so X and Y arrays are the same length
    const length = Base_Graph_Coordinates.X.length;
    let baseStr = "";
    for (let i = 0; i < length; i+=2) {
        baseStr += `<line x1="${Base_Graph_Coordinates.X[i]}" y1="${Base_Graph_Coordinates.Y[i]}" x2="${Base_Graph_Coordinates.X[i+1]}" y2="${Base_Graph_Coordinates.Y[i+1]}" />`;
    }

    Base_Graph.innerHTML = baseStr;

    // Calculate cost for each hour of spending
    let cost_data = [];
    
    for (let i = 0; i < Elering_Data.length; i++) {
        let j = 11;
        cost_data.push(Number(Number(Elering_Data[i].price * Number(CSV_Data[j][4].replace(",", "."))).toFixed(3)));
        j++;
    }
    console.log(cost_data);

    // Find highest cost
    let highestCost = cost_data[0];
    for(let i = 0; i < cost_data.length; i++) {
        if(cost_data[i] > highestCost) {
            highestCost = cost_data[i];
        }
    }
    console.log(highestCost);

    // Map cost data to cost graph
    let lineStr = "";
    const cost_ratio = 150 / highestCost;
    let x1 = 61;
    let x2 = 61 + horizontalWidthBetweenStrokes;
    for(let i = 0; i < cost_data.length; i++) {
        let y = 200 - cost_data[i] * cost_ratio;
        lineStr += `<line id="cost${cost_data[i]}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2" />`;
        x1 += horizontalWidthBetweenStrokes;
        x2 += horizontalWidthBetweenStrokes;
    }
    Cost_Graph.innerHTML += lineStr;

}