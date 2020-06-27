import * as vscode from 'vscode';
import Axios, { AxiosResponse, AxiosError } from 'axios';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "extsn" is now active!');

	// Implementation of the command provided with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extsn.getProblem', async () => {
		// vscode.window.showInformationMessage('Running HelloWorld...');
		try {
			const result: any = await Axios.post("http://localhost:3000/problem", {
				source: "r/dailyprogrammer"
			});
			const text = result.data.problem
			console.log(text)
			vscode.window.showInformationMessage(text);
		} catch (e) {
			console.error("Err")
			vscode.window.showInformationMessage("error");
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }