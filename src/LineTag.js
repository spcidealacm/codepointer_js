const vscode = require("vscode");
const { Data } = require("./Data.js");
class Tag {
    constructor() {
        this.decorationNodesData = {
            light: { border: "2px solid #666", borderRadius: "3px" },
            dark: { border: "2px solid #fff", borderRadius: "3px" }
        };
        this.decorationLinesData = {
            light: { borderColor: "#666", borderStyle: "none none none dashed", borderWidth: "2px" },
            dark: { borderColor: "#eee", borderStyle: "none none none dashed", borderWidth: "2px" }
        };
        this.decorationLinesTopData = {
            light: { borderColor: "#666", borderStyle: "dashed none none none", borderWidth: "2px" },
            dark: { borderColor: "#eee", borderStyle: "dashed none none none", borderWidth: "2px" }
        };
        this.decorationLinesBottomData = {
            light: { borderColor: "#666", borderStyle: "none none dashed none", borderWidth: "2px" },
            dark: { borderColor: "#eee", borderStyle: "none none dashed none", borderWidth: "2px" }
        };
        this.decorationNodeType = null;
        this.decorationLineType = null;
        this.decorationLineTopType = null;
        this.decorationLineBottomType = null;
    }
    on(editors) {
        if (this.decorationNodeType) {
            return;
        }
        this.decorationLineType = vscode.window.createTextEditorDecorationType(this.decorationLinesData);
        this.decorationLineTopType = vscode.window.createTextEditorDecorationType(this.decorationLinesTopData);
        this.decorationLineBottomType = vscode.window.createTextEditorDecorationType(this.decorationLinesBottomData);
        this.decorationNodeType = vscode.window.createTextEditorDecorationType(this.decorationNodesData);
        for (let editor of editors) {
            editor.setDecorations(this.decorationLineType, this.range(Data.compare(editor))["lines"]);
            editor.setDecorations(this.decorationLineTopType, this.range(Data.compare(editor))["top"]);
            editor.setDecorations(this.decorationLineBottomType, this.range(Data.compare(editor))["bottom"]);
            editor.setDecorations(this.decorationNodeType, this.range(Data.compare(editor))["nodes"]);
        }
    }
    off() {
        var _a, _b, _c, _d;
        (_a = this.decorationNodeType) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.decorationLineType) === null || _b === void 0 ? void 0 : _b.dispose();
        (_c = this.decorationLineTopType) === null || _c === void 0 ? void 0 : _c.dispose();
        (_d = this.decorationLineBottomType) === null || _d === void 0 ? void 0 : _d.dispose();
        this.decorationNodeType = null;
        this.decorationLineType = null;
        this.decorationLineTopType = null;
        this.decorationLineBottomType = null;
    }
    range(info) {
        let result = {
            nodes: [],
            lines: [],
            top: [],
            bottom: []
        };
        for (let i in info) {
            for (let j = 0; j < info[i].length; j++) {
                let item = info[i][j];
                let start = new vscode.Position(item["ln"], item["cl"]);
                let end = new vscode.Position(item["ln"], item["ed"]);
                result.nodes.push(new vscode.Range(start, end));
                if (j + 1 < info[i].length) {
                    let itemNext = info[i][j + 1];
                    let itemStart = item["ln"] < itemNext["ln"] ? item : itemNext;
                    let itemEnd = item["ln"] > itemNext["ln"] ? item : itemNext;
                    for (let k = itemStart["ln"] + 1; k < itemEnd["ln"]; k++) {
                        start = new vscode.Position(k, 0);
                        end = new vscode.Position(k, 1);
                        result.lines.push(new vscode.Range(start, end));
                    }
                    start = new vscode.Position(itemStart["ln"], 0);
                    end = new vscode.Position(itemStart["ln"], itemStart["cl"]);
                    result.bottom.push(new vscode.Range(start, end));
                    start = new vscode.Position(itemEnd["ln"], 0);
                    end = new vscode.Position(itemEnd["ln"], itemEnd["cl"]);
                    result.top.push(new vscode.Range(start, end));
                }
            }
        }
        return result;
    }
}

module.exports = {
    Tag
}