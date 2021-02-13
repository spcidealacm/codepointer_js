const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
class Data {
    static achieve() {
        return fs.readFileSync(path.join(vscode.workspace.rootPath ? vscode.workspace.rootPath : "", "example.txt"), "utf-8");
    }
    static analysis() {
        let data = this.achieve();
        let reg1 = RegExp("(\\([^\\)]+\\)\\s*-->\\s*)+\\([^\\)]+\\)", "g");
        let reg2 = RegExp("ln:\\s*([1-9]\\d*|0)\\s+cl:\\s*([1-9]\\d*|0)\\s+fl:\\s*[^\\)|^\\s]+", "g");
        let dirname = vscode.workspace.rootPath ? vscode.workspace.rootPath : "";
        let result1, result2, result3, result = [];
        while (result1 = reg1.exec(data)) {
            let subResult = [];
            while (result2 = reg2.exec(result1[0])) {
                result3 = result2[0].replace(/:/g, " ").split(/\s+/);
                let line = +result3[1] - 1 < 0 ? 0 : +result3[1] - 1;
                let cline = +result3[3] - 1 < 0 ? 0 : +result3[3] - 1;
                let info = { ln: line, cl: cline, ed: +result3[3], fl: path.join(dirname, result3[5]) };
                subResult.push(info);
            }
            result.push(subResult);
        }
        return result;
    }
    static compare(editor) {
        let data = this.analysis();
        let result = [];
        for (let i in data) {
            let team = [];
            for (let j in data[i]) {
                if (editor.document.uri.fsPath === data[i][j]["fl"]) {
                    let textInfo = editor.document.lineAt(data[i][j]["ln"]);
                    let pos = this.compareNode(textInfo.text, data[i][j]["cl"]);
                    data[i][j]["cl"] = pos.cl;
                    data[i][j]["ed"] = pos.ed;
                    team.push(data[i][j]);
                }
                else {
                    if (team.length) {
                        result.push(team);
                        team = [];
                    }
                }
            }
            if (team.length) {
                result.push(team);
            }
        }
        return result;
    }
    static compareNode(text, currentLine) {
        let result = { cl: currentLine + 1, ed: currentLine + 1 };
        let reg = RegExp(/\w/);
        for (let i = currentLine; i > 0; i--) {
            let inculdeWord = reg.exec(text[i]);
            if (inculdeWord && inculdeWord[0]) {
                result.cl--;
            }
            else {
                break;
            }
        }
        for (let i = currentLine + 1; i < text.length; i++) {
            let inculdeWord = reg.exec(text[i]);
            if (inculdeWord && inculdeWord[0]) {
                result.ed++;
            }
            else {
                break;
            }
        }
        return result;
    }
}

module.exports = {
    Data
}