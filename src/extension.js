const vscode = require('vscode');
const { Tag } = require("./LineTag.js");
function activate(context) {
	let tag = new Tag();
	tag.on(vscode.window.visibleTextEditors);
	vscode.window.onDidChangeVisibleTextEditors(
		function (editors) {
			tag.off();
			tag.on(editors);
		}, null, context.subscriptions
	);

	vscode.workspace.onDidChangeTextDocument(
		function () {
			tag.off();
			tag.on(vscode.window.visibleTextEditors);
		}, null, context.subscriptions
	);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
