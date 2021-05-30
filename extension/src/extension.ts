import * as vscode from 'vscode';
import Axios, { AxiosResponse } from 'axios';
import * as fs from "fs";
import * as path from "path";
import { render } from "mustache";
import { BASE_URL, TEMPLATE, PYTHON, JAVASCRIPT } from "./constants";
import { AllHtmlEntities } from "html-entities";

// TODO: get this working
// import * as template from "./template.md"

export const activate = (context: vscode.ExtensionContext) => {
	console.log("Puzzles is now active!");

	const reddit = vscode.commands.registerCommand('extsn.getReddit', async () => {
		try {
			await generateProblem("reddit");
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`);
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	const projectEuler = vscode.commands.registerCommand('extsn.getProjectEuler', async () => {
		try {
			await generateProblem("projectEuler");
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`);
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	const codingBat = vscode.commands.registerCommand('extsn.getCodingBat', async () => {
		try {
			await generateProblem("codingBat");
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`);
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	// Register functions
	context.subscriptions.push(reddit, projectEuler, codingBat);
};

const generateProblem = async (source: string): Promise<any> => {
	const data = await textFromSource(source);
	createFile(data.problem, source, data.id);
};

const textFromSource = async (source: string): Promise<any> => {
  const response: AxiosResponse = await Axios.get(`${BASE_URL}/puzzle/${source}`);
  console.log(response);
  return response.data;
}

const createDir = (): string => {
	const today = new Date();
	const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' });
	const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(today);
	const dirName = `${day}-${month}-${year}`;

	if (vscode.workspace.workspaceFolders) {
		const vscodePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    console.log('path', vscodePath);
		const normalizedPath = path.normalize(vscodePath);
		try {
			fs.mkdir(`${normalizedPath}/${dirName}`, (err) => console.error(err));
		} catch (e) {
			console.error(`Error: ${e}`);
		}
	} else {
		vscode.window.showInformationMessage("Open a folder first to generate your problem in!");
	}


	return dirName;
};

const createFile = (problem: string, source: string, id: string | number) => { // url: string
	const dirName = createDir();
	// const template = fs.readFileSync(`./template.md`).toString();

	const data = {
    title: "Today's Puzzle",
    date: new Date().toLocaleDateString(),
    source,
    id,
    // url,
		problem,
	};

	const fileNameExtension = source.toLowerCase();

	if (vscode.workspace.workspaceFolders) {
		const vscodePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    console.log('path', vscodePath);
		const normalizedPath = path.normalize(vscodePath);
		// Render template with Mustache
		const output = render(TEMPLATE, data);
		fs.writeFileSync(`${normalizedPath}/${dirName}/${fileNameExtension}.md`, output);
		fs.writeFileSync(`${normalizedPath}/${dirName}/${fileNameExtension}.py`, PYTHON);
	} else {
		// vscode.window.showInformationMessage("Open a folder first to generate your problem in!");
	}
};

export const deactivate = () => { };