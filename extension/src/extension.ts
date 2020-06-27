import * as vscode from 'vscode';
import Axios, { AxiosResponse, AxiosError } from 'axios';
import * as fs from "fs";
import { render } from "mustache";
import { BASE_URL, TEMPLATE, PYTHON } from "./constants";
import { AllHtmlEntities } from "html-entities";

// TODO: get this working
// import * as template from "./template.md"

export const activate = (context: vscode.ExtensionContext) => {
	console.log("Daily Problem is now active!");
	
	const reddit = vscode.commands.registerCommand('extsn.getReddit', async () => {
		try {
			await generateProblem("reddit");
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`)
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	const projectEuler = vscode.commands.registerCommand('extsn.getProjectEuler', async () => {
		try {
			await generateProblem("projectEuler");
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`)
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	const codingBat = vscode.commands.registerCommand('extsn.getCodingBat', async () => {
		try {
			await generateProblem("codingBat");
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`)
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
	});

	// Register functions
	context.subscriptions.push(reddit, projectEuler, codingBat);
}

const generateProblem = async (source: string): Promise<any> => {
	const text = await textFromSource(source);
	createFile(text, source);
}

const textFromSource = async (source: string): Promise<any> => {
	const result = await Axios.post(`${BASE_URL}/problem`, {
		source: source
	})
	return result.data.problem
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

const createFile = (text: string, source: string) => {
	const dirName = createDir();
	// const template = fs.readFileSync(`./template.md`).toString();

	const entities = new AllHtmlEntities();
	const markdown = entities.decode(text);
	console.log('md', markdown);

	const data = {
		title: "Daily Problem",
		source: source,
		problem: markdown,
	}

	const fileNameExtension = source.toLowerCase();

	// Render template with Mustache
	const output = render(TEMPLATE, data)
	fs.writeFileSync(`${__dirname}/${dirName}/${fileNameExtension}.md`, output);
	fs.writeFileSync(`${__dirname}/${dirName}/${fileNameExtension}.py`, PYTHON);
}

export const deactivate = () => { }