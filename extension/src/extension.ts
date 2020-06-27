import * as vscode from 'vscode';
import Axios, { AxiosResponse, AxiosError } from 'axios';
import * as fs from "fs";
import { render } from "mustache";
// TODO: get this working
// import * as template from "./template.md"

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "extsn" is now active!');

	// Implementation of the command provided with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extsn.getProblem', async () => {
		// vscode.window.showInformationMessage('Running HelloWorld...');
		try {
			const result: any = await Axios.post("http://localhost:3000/problem", {
				source: "reddit"
			});
			const text = result.data.problem
			createFile(text);
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`)
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	context.subscriptions.push(disposable);
}

const createDir = (): string => {
	const today = new Date();
	const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' })
	const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(today)
	const dirName = `${day}-${month}-${year}`
	try {
		fs.mkdir(`${__dirname}/${dirName}`, (err) => console.error(err));
	} catch (e) {
		console.error(`Error: ${e}`)
	}
	return dirName;
}

const createFile = (text: string): null => {
	const dirName = createDir();

	// const template = fs.readFileSync(`./template.md`).toString();
	const template = `# {{ title }} (by Daily Problem)

## from {{ source }}

{{ problem }}
`

	const data = {
		title: "Reddit Challenge",
		source: "r/dailyprogrammer",
		problem: text,
	}

	// Render template with Mustache
	const output = render(template, data)
	fs.writeFileSync(`${__dirname}/${dirName}/problem.md`, output);
	fs.writeFileSync(`${__dirname}/${dirName}/solution.py`, `# Write your solution here!`);
	return null;
}

export function deactivate() { }