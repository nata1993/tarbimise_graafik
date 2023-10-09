class TextBuilder {
    static SetTextVariablesAndBuildText(svg_id, graph_coordinates, font, fontSize, opacity, graph_max_values, electricity_lowest_price) {
        const element = document.getElementById(svg_id);
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

        text += this._AddEleringGraphText(text_x1, text_y1, text_x2, text_y2, graph_max_values[0], electricity_lowest_price);

        graph_x1 = graph_coordinates[1].xy1[0];
        graph_x2 = graph_coordinates[1].x1y1[0];
        graph_y1 = graph_coordinates[1].xy[1];
        graph_y2 = graph_coordinates[1].xy1[1];
        text_x1 = graph_x1;
        text_y1 = graph_y1;
        text_x2 = graph_x2;
        text_y2 = graph_y2;

        text += this._AddConsumptionGraphText(text_x1, text_y1, text_x2, text_y2, graph_max_values[1]);

        graph_x1 = graph_coordinates[2].xy1[0];
        graph_x2 = graph_coordinates[2].x1y1[0];
        graph_y1 = graph_coordinates[2].xy[1];
        graph_y2 = graph_coordinates[2].xy1[1];
        text_x1 = graph_x1;
        text_y1 = graph_y1;
        text_x2 = graph_x2;
        text_y2 = graph_y2;

        text += this._AddCostGraphText(text_x1, text_y1, text_x2, text_y2, graph_max_values[2]);

        element.innerHTML += text;
    }

    static _AddEleringGraphText (x1, y1, x2, y2, max_value, min_value) {
        const y3 = ((y1-y2) * 0.9) + y2 + 3;
        let _text = `<text x="${x1+10}" y="${y1+5}">NPS price + 20% VAT</text>`;
        _text += `<text x="${x1+10}" y="${y1+18}">\u00A2/kWh</text>`;
        _text += `<text text-anchor="end" x="${x1-10}" y="${y2+4}">${min_value}</text>`;
        _text += `<text text-anchor="end" x="${x1-10}" y="${y3}">${max_value}</text>`;
        return _text;
    }
    static _AddConsumptionGraphText (x1, y1, x2, y2, max_value) {
        const y3 = ((y1-y2) * 0.9) + y2 + 3;
        let _text = `<text x="${x1+10}" y="${y1+5}">Consumption</text>`;
        _text += `<text x="${x1+10}" y="${y1+18}">kWh</text>`;
        _text += `<text text-anchor="end" x="${x1-10}" y="${y2+4}">0</text>`;
        _text += `<text text-anchor="end" x="${x1-10}" y="${y3}">${max_value}</text>`;
        return _text;
    }
    static _AddCostGraphText (x1, y1, x2, y2, max_value) {
        const y3 = ((y1-y2) * 0.9) + y2 + 3;
        let _text = `<text x="${x1+10}" y="${y1+5}">Cost</text>`;
        _text += `<text x="${x1+10}" y="${y1+18}">\u00A2</text>`;
        _text += `<text text-anchor="end" x="${x1-10}" y="${y2+4}">0</text>`;
        _text += `<text text-anchor="end" x="${x1-10}" y="${y3}">${max_value}</text>`;
        return _text;
    }
}