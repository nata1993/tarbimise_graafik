class TextBuilder {
    static AddEleringGraphText (id, x, y) {
        const element = document.getElementById(id);
        element.style.fontFamily = "Arial";
        element.style.fontSize = 8;
        element.style.color = "#000000";
        element.style.opacity = 0.5;
        text = "";
        text += `<text x="${x}" y="${y}">NPS price</text>`;
        //text += `<text x="${x}" y="${y}">Consumption</text>`;
        //text += `<text x="${x}" y="${y}">Cost</text>`;
        /*text += `<text x="${x}" y="${y}"></text>`;
        text += `<text x="${x}" y="${y}"></text>`;
        text += `<text x="${x}" y="${y}"></text>`;
        text += `<text x="${x}" y="${y}"></text>`;*/
        element.innerHTML += text;
    }
/*
    static AddConsumptionGraphText (id) {
        const element = document.getElementById(id);
        element.style.fontFamily = "Arial";
        element.style.fontSize = 8;
        element.style.opacity = 0.5;
        text = "";
        text += `<text x="${}" y="${}">Consumption</text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        element.innerHTML += text;
    }

    static AddCostGraphText (id) {
        const element = document.getElementById(id);
        element.style.fontFamily = "Arial";
        element.style.fontSize = 8;
        element.style.opacity = 0.5;
        text = "";
        text += `<text x="${}" y="${}">Cost</text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        element.innerHTML += text;
    }
    */
}