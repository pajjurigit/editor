ace.provide("ace.layer.Marker");

ace.layer.Marker = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer marker-layer";
    parentEl.appendChild(this.element);

    this.markers = {};
    this.$markerId = 1;
};

(function() {

    this.setDocument = function(doc) {
        this.doc = doc;
    };

    this.addMarker = function(range, clazz, type) {
        var id = this.$markerId++;
        this.markers[id] = {
            range : range,
            type : type || "line",
            clazz : clazz
        };

        this.update();
        return id;
    };

    this.removeMarker = function(markerId) {
        var marker = this.markers[markerId];
        if (marker) {
            delete (this.markers[markerId]);
            this.update();
        }
    };

    this.update = function(config) {
        var config = config || this.config;
        if (!config)
            return;

        this.config = config;

        var html = [];
        for ( var key in this.markers) {
            var marker = this.markers[key];
            var range = {
                start: marker.range.start,
                end: marker.range.end
            };

            // clip
            if (range.start.row > config.lastRow) continue;
            if (range.end.row < config.firstRow) continue;

            if (range.end.row > config.lastRow) {
                range.end = {
                    row: config.lastRow+1,
                    column: 0
                };
            }

            if (range.start.row < config.firstRow) {
                range.start = {
                    row: config.firstRow,
                    column: 0
                };
            }

            if (range.start.row !== range.end.row) {
                if (marker.type == "text") {
                    this.drawTextMarker(html, range, marker.clazz, config);
                } else {
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
                }
            }
            else {
                this.drawSingleLineMarker(html, range, marker.clazz, config);
            }
        }
        this.element.innerHTML = html.join("");
    };

    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig) {

        // selection start
        var row = range.start.row;
        var lineRange = { start: {}, end: {}};

        lineRange.start.row = row;
        lineRange.start.column = range.start.column;
        lineRange.end.row = row;
        lineRange.end.column = this.doc.getLine(row).length;
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);

        // selection end
        var row = range.end.row;
        lineRange.start.row = row;
        lineRange.start.column = 0;
        lineRange.end.row = row;
        lineRange.end.column = range.end.column;
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);

        for (var row = range.start.row + 1; row < range.end.row; row++) {
            lineRange.start.row = row;
            lineRange.end.row = row;
            lineRange.end.column = this.doc.getLine(row).length;
            this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);
        }
    };

    this.drawMultiLineMarker = function(stringBuilder, range, clazz, layerConfig) {

        var height = layerConfig.lineHeight;
        var width = Math.round(layerConfig.width - (range.start.column * layerConfig.characterWidth));
        var top = (range.start.row - layerConfig.firstRow) * layerConfig.lineHeight;
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;'></div>"
        );

        var top = (range.end.row - layerConfig.firstRow) * layerConfig.lineHeight;
        var width = Math.round(range.end.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "width:", width, "px;'></div>"
        );

        for (var row = range.start.row + 1; row < range.end.row; row++) {
            var top = (row - layerConfig.firstRow) * layerConfig.lineHeight;
            stringBuilder.push(
                "<div class='", clazz, "' style='",
                "height:", height, "px;",
                "width:", layerConfig.width, "px;",
                "top:", top, "px;'></div>"
            );
        }
    };

    this.drawSingleLineMarker = function(stringBuilder, range, clazz, layerConfig) {

        var height = layerConfig.lineHeight;
        var width = Math.round((range.end.column - range.start.column) * layerConfig.characterWidth);
        var top = (range.start.row - layerConfig.firstRow) * layerConfig.lineHeight;
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left,"px;'></div>"
        );
    };

}).call(ace.layer.Marker.prototype);