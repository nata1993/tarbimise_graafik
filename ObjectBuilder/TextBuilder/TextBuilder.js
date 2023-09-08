class TextBuilder {
    static SetTextVariablesAndBuildText(id, graph_coordinates, font, fontSize, opacity) {
        const element = document.getElementById(id);
        element.style.fontFamily = font;
        element.style.fontSize = fontSize;
        element.style.opacity = opacity;
        let text = "";

        let graph_x1 = graph_coordinates[0].xy1[0];
        let graph_x2 = graph_coordinates[0].x1y1[0];
        let graph_y1 = graph_coordinates[0].xy[1];
        let graph_y2 = graph_coordinates[0].xy1[1];
        let text_x1 = graph_x1;
        let text_y1 = graph_y1;
        let text_x2 = graph_x2;
        let text_y2 = graph_y2;

        text += this._AddEleringGraphText(text_x1, text_y1, text_x2, text_y2);

        graph_x1 = graph_coordinates[1].xy1[0];
        graph_x2 = graph_coordinates[1].x1y1[0];
        graph_y1 = graph_coordinates[1].xy[1];
        graph_y2 = graph_coordinates[1].xy1[1];
        text_x1 = graph_x1;
        text_y1 = graph_y1;
        text_x2 = graph_x2;
        text_y2 = graph_y2;

        text += this._AddConsumptionGraphText(text_x1, text_y1, text_x2, text_y2);

        graph_x1 = graph_coordinates[2].xy1[0];
        graph_x2 = graph_coordinates[2].x1y1[0];
        graph_y1 = graph_coordinates[2].xy[1];
        graph_y2 = graph_coordinates[2].xy1[1];
        text_x1 = graph_x1;
        text_y1 = graph_y1;
        text_x2 = graph_x2;
        text_y2 = graph_y2;

        text += this._AddCostGraphText(text_x1, text_y1, text_x2, text_y2);

        element.innerHTML += text;
    }

    static _AddEleringGraphText (x1, y1, x2, y2) {
        let _text = `<text x="${x1+10}" y="${y1+3}">NPS price</text>`;
        _text += `<text x="${x1+10}" y="${y1+16}">€/kWh</text>`;
        _text += `<text x="${x1-15}" y="${y2+4}">0</text>`;
        _text += `<text x="${x1}" y="${y1+100}">insert max price</text>`;
        return _text;
    }
    static _AddConsumptionGraphText (x1, y1, x2, y2) {
        let _text = `<text x="${x1+10}" y="${y1+3}">Consumption</text>`;
        _text += `<text x="${x1+10}" y="${y1+16}">kWh</text>`;
        _text += `<text x="${x1-15}" y="${y2+4}">0</text>`;
        _text += `<text x="${x1}" y="${y1+100}">insert max consumption</text>`;
        return _text;
    }
    static _AddCostGraphText (x1, y1, x2, y2) {
        let _text = `<text x="${x1+10}" y="${y1+3}">Cost</text>`;
        _text += `<text x="${x1+10}" y="${y1+16}">€</text>`;
        _text += `<text x="${x1-15}" y="${y2+4}">0</text>`;
        _text += `<text x="${x1}" y="${y1+100}">insert max cost</text>`;
        return _text;
    }
}