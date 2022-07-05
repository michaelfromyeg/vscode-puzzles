import * as vscode from 'vscode';
import Axios, { AxiosResponse } from 'axios';
import * as fs from "fs";
import * as path from "path";
import { render } from "mustache";
import {
  BASE_URL,
  TEMPLATE,
  LANGUAGES
} from "./constants";
// import { AllHtmlEntities } from "html-entities";

// TODO: refactor so that files can be actual files and not strings in TypeScript
// import * as template from "./template.md"

/**
 * Setup all of the commands; called on installation.
 *
 * @param context
 */
export const activate = (context: vscode.ExtensionContext) => {
	console.log("Puzzles is now active!");

	const reddit = vscode.commands.registerCommand('extsn.getReddit', redditHandler);
	const projectEuler = vscode.commands.registerCommand('extsn.getProjectEuler', projectEulerHandler);
  const codingBat = vscode.commands.registerCommand('extsn.getCodingBat', codingBatHandler);
  const adventOfCode = vscode.commands.registerCommand('extsn.getAdventOfCode', adventOfCodeHandler);

	// Register functions
	context.subscriptions.push(reddit, projectEuler, codingBat, adventOfCode);
};

/**
 * Call generateProblem for Reddit, without any additional arguments.
 *
 * TODO: add support for specifying problem ID.
 */
const redditHandler = async () => {
  try {
    await generateProblem("reddit", undefined);
    vscode.window.showInformationMessage("Problem created! Get to solving.");
  } catch (e) {
    console.error(`Error: ${e}`);
    vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
  }
}

/**
 * Call generateProblem for ProjectEuler, with an optional project ID.
 */
const projectEulerHandler = async () => {
  try {
    let id = await vscode.window.showInputBox({
      // title: 'Problem ID',
      prompt: 'Enter a problem ID (a number from 1 to 784) or leave empty for a random problem.'
    });
    if (id === '') {id = undefined;}
    await generateProblem("projectEuler", id);
    vscode.window.showInformationMessage("Problem created! Get to solving.");
  } catch (e) {
    console.error(`Error: ${e}`);
    vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
  }
}

/**
 * Call generateProblem for codingBat, without any additional arguments.
 */
const codingBatHandler = async () => {
		try {
			await generateProblem("codingBat", undefined);
			vscode.window.showInformationMessage("Problem created! Get to solving.");
		} catch (e) {
			console.error(`Error: ${e}`);
			vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
		}
}

/**
 * Create an advent of code problem for a specified year and date.
 *
 * If year and date left blank, year is set to current year and date is set to the latest date available in December.
 * Theoretically, this should be "today's problem."
 */
const adventOfCodeHandler = async () => {
  try {
    // Get the year input from a user; TODO refactor to template
    let yearInput: string | undefined | number = await vscode.window.showInputBox({
      prompt: 'Enter a year from 2015 to the current year, or leave blank to select the current year.',
    });
    if (yearInput === '' || yearInput === undefined) { yearInput = (new Date()).getFullYear()}

    // Get the day input from a user; TODO refactor to template
    let dayInput: string | undefined | number = await vscode.window.showInputBox({
      prompt: 'Enter a day from 1 to 25, or leave blank for the latest available date in the current year.'
    });
    if (dayInput === '' || dayInput === undefined) {
      const today = new Date();
      if (today.getMonth() === 11) {
        // `11` is the month of December, in JavaScript land!
        dayInput = today.getDate();
      } else {
        dayInput = 1;
      }
    }

    if (yearInput < 2015) {
      throw new Error("Invalid year");
    }

    if (dayInput < 1 || dayInput > 25) {
      throw new Error("Invalid day");
    }

    // adventOfCode ID is in the form YYYY/day/DD, such as 2021/day/25 for Christmas Day!
    await generateProblem("adventOfCode", `${yearInput}/day/${dayInput}`);
  } catch (e) {
    console.error(`Error: ${e}`);
    vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
  }
}

/**
 * Create a problem instance by first calling the backend API and then generating the needed files.
 *
 * @param source
 * @param id
 */
const generateProblem = async (source: string, id: string | undefined): Promise<any> => {
	const data = await textFromSource(source, id);
	createFile(data.problem, source, data.id);
};

/**
 * Call the API to fetch problem data and return JSON payload.
 *
 * @param source
 * @param id
 * @returns
 */
const textFromSource = async (source: string, id: string | undefined): Promise<any> => {
  const apiUrl = `${BASE_URL}/puzzle/${source}`;
  const response: AxiosResponse = await Axios.get(typeof id === 'string' ? `${apiUrl}?id=${id}` : apiUrl);

  console.log(response);

  return response.data;
};

/**
 * Generate a directory to hold the problem file and solution file.
 *
 * @returns {string} the directory name
 */
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

/**
 * Create both the problem text file and the solution file.
 *
 * @param problem
 * @param source
 * @param id
 */
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
		fs.writeFileSync(`${normalizedPath}/${dirName}/${fileNameExtension}.${LANGUAGES.python[0]}`, LANGUAGES.python[1]);
	} else {
		vscode.window.showInformationMessage("Open a folder first to generate your problem in!");
	}
};

export const deactivate = () => { };
