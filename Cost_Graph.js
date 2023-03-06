// Draw graph from CSV file
function drawCostGraph(Elering_Data, CSV_Data){
    // Get SVG container width
    const Cost_SVG_Width = document.getElementById("cost").getBoundingClientRect().width;

    // Find elements to work with
    const Cost_Graph = document.getElementById("costGraph");
    const Text_Group = document.getElementById("costText");
    const Base_Graph = document.getElementById("costBaseGraph");

    // Clear the contents of SVG before redrawing
    Cost_Graph.innerHTML = "";
    Text_Group.innerHTML = "";

    // Variables
    const Graph_Offset_From_End = 50; // Defines offset from SVG container end in pixels
    const Horizontal_Graph_End_Position = Cost_SVG_Width - Graph_Offset_From_End; // Defines how far the horisontal graph should go
    const Horizontal_Graph_End_Position_Of_Strokes = Horizontal_Graph_End_Position - 85; // Defines how far the strokes on horisontal graph should go

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


}

