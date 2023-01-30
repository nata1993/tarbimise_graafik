// Get user set date range from inputs
function dateRange () {
    const date_start = document.getElementById("date_start");
    const date_end = document.getElementById("date_end");
    const date_settings = [];
    date_settings.push(date_start.value, date_end.value);

    return date_settings;
}

// Use user set date range for retrieving Nord Pool Spot electricity prices by Elering API means and generate prices table
function getDataFromElering(date_setting) {
    const url = `https://dashboard.elering.ee/api/nps/price?start=${date_setting[0]}T00%3A00%3A00.000Z&end=${date_setting[1]}T00%3A00%3A00.000Z`;
    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // Drawing graph to canvas
            let canvas = document.getElementById("npsPrices");
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#CCC";
            ctx.fillRect(0, 0, 500, 250);
            // Vertical line
            ctx.beginPath();
            ctx.moveTo(60, 25);
            ctx.lineTo(58, 30);
            ctx.moveTo(60, 25);
            ctx.lineTo(62, 30);
            ctx.moveTo(60, 25);
            ctx.lineTo(60, 200);
            // Horizontal line
            ctx.lineTo(475, 200);
            ctx.lineTo(470, 202);
            ctx.moveTo(475, 200);
            ctx.lineTo(470, 198);
            ctx.font = "8px arial";
            ctx.fillStyle = "#000";
            ctx.fillText("0", 50, 210)
            ctx.fillText("NPS price", 10, 40);
            ctx.fillText("MWh", 10, 50);
            ctx.fillText("Hours", 425, 235);
            // Draws small strokes to horisontal line
            let widthBetweenPoints = 385/res.data.ee.length;
            let dataPointCount = res.data.ee.length;
            let x = 60 + widthBetweenPoints;
            let x2 = 57 + widthBetweenPoints;
            ctx.moveTo(x, 200);
            for(var i = 0; i < dataPointCount; i++) {
                let width = x + (i * widthBetweenPoints);
                ctx.moveTo(width, 195);
                ctx.lineTo(width, 205);
            }
            ctx.moveTo(x, 205);
            // Draws diagonal lines to small vertical lines
            for(var i = 0; i < dataPointCount; i++) {
                let width = x + (i * widthBetweenPoints);
                let width2 = x2 + (i * widthBetweenPoints) - 1;
                ctx.moveTo(width, 205);
                ctx.lineTo(width2, 212);
                ctx.fillText(i+1, width2-5, 222);
            }
            // Filter out highest price within given data sample
            let areaPrices = Object.values(res.data.ee);
            const maxPrice = maxValueFromDataset(areaPrices)*1.2;
            const highestPriceOnGraph = Math.round(maxPrice/10)*10;
            // Draws small strokes to vertical line
            dataPointCount = highestPriceOnGraph/5;
            widthBetweenPoints = 150/dataPointCount;
            let y = 200 - widthBetweenPoints;
            x = 55;
            x2 = 65;
            for(var i = 0; i < dataPointCount; i++) {
                let width = y - (i * widthBetweenPoints);
                ctx.fillText(`${5 * (i + 1)}`, x-15, width);
                ctx.moveTo(x, width);
                ctx.lineTo(x2, width);
            }

            ctx.stroke();

            // Draws small dots where hour price is on graph
            const fullCircleInRadians = 360*Math.PI/180;

            widthBetweenPoints = 385/res.data.ee.length;
            let calculatedX = 60;
            let calculatedY = null;
            let baseY = 200;    

            for(const item of res.data.ee) {
                calculatedX += widthBetweenPoints;
                calculatedY = baseY - item["price"];
                hourPrice = item["price"];
                ctx.fillStyle = "#F00";
                if(hourPrice <= 50) {
                    ctx.fillStyle = "#0F0";
                }
                else if(hourPrice > 50 && hourPrice <= 110) {
                    ctx.fillStyle = "#FF0";
                }
                else {
                    console.log("red");
                }
                ctx.beginPath();
                
                ctx.arc(calculatedX, calculatedY, 3, 0, fullCircleInRadians, false);
                ctx.fill();
            };
            /*for(var i = 0; i < dataPointCount; i++) {
                ctx.beginPath();
                calculatedX += widthBetweenPoints;
                    calculatedY = baseY - res.data.ee[i]["price"];
                    hourPrice = res.data.ee[i]["price"];
                if(hourPrice <= 50) {
                    ctx.fillStyle = "#0F0";
                }
                else if(hourPrice > 50 || hourPrice <= 100) {
                    ctx.fillStyle = "#00F";
                }
                else {
                    ctx.fillStyle = "#F00";
                }
                ctx.arc(calculatedX, calculatedY, 3, 0, fullCircleInRadians, false);
                ctx.fill();
            }*/
            
        })
        .catch(err => {throw err});
}

// Calculate electricity consumption for user based on Nord Pool Spot prices and user consumption and generate table from calculations
function calculate() {
    // Check if user did not choose date range
    let value1 = document.getElementById("date_start").value;
    let value2 = document.getElementById("date_end").value;
    if(value1.length == 0 || value2.length == 0) {
        // Drawing note for user to canvas
        let canvas = document.getElementById("npsPrices");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#CCC";
        ctx.fillRect(0, 0, 500, 250);
        ctx.fillStyle = "#000";
        ctx.font = "30px arial";
        ctx.fillText("Please select date range", 100, 100);
    }
    else {
        const date_setting = dateRange();
        getDataFromElering(date_setting);
    }
}

// Helper function for filtering out max price within dataset
function maxValueFromDataset(dataSample) {
    let max = 0;
    for(var i = 0; i < dataSample.length; i++) {
        if (dataSample[i].price > max) {
            max = dataSample[i].price;
        }
    }
    return max;
}