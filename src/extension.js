const vscode = require('vscode');

function activate(context) {

	console.log('Congratulations, your extension "codepointer" is now active!');

	let disposable = vscode.commands.registerCommand('codepointer.helloWorld', function () {

		vscode.window.showInformationMessage('Hello World from codepointer!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
