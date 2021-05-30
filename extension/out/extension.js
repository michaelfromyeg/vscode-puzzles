"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const fs = require("fs");
const path = require("path");
const mustache_1 = require("mustache");
const constants_1 = require("./constants");
// TODO: get this working
// import * as template from "./template.md"
exports.activate = (context) => {
    console.log("Puzzles is now active!");
    const reddit = vscode.commands.registerCommand('extsn.getReddit', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield generateProblem("reddit", undefined);
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (e) {
            console.error(`Error: ${e}`);
            vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
        }
    }));
    const projectEuler = vscode.commands.registerCommand('extsn.getProjectEuler', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const input = yield vscode.window.showInputBox({
                // title: 'Problem ID',
                prompt: 'Enter a problem ID (a number from 1 to 784) or leave empty for a random problem.'
            });
            yield generateProblem("projectEuler", input);
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (e) {
            console.error(`Error: ${e}`);
            vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
        }
    }));
    const codingBat = vscode.commands.registerCommand('extsn.getCodingBat', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield generateProblem("codingBat", undefined);
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (e) {
            console.error(`Error: ${e}`);
            vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
        }
    }));
    // Register functions
    context.subscriptions.push(reddit, projectEuler, codingBat);
};
const generateProblem = (source, id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield textFromSource(source, id);
    createFile(data.problem, source, data.id);
});
const textFromSource = (source, id) => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = `${constants_1.BASE_URL}/puzzle/${source}`;
    const response = yield axios_1.default.get(typeof id === 'string' ? `${apiUrl}?id=${id}` : apiUrl);
    console.log(response);
    return response.data;
});
const createDir = () => {
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
        }
        catch (e) {
            console.error(`Error: ${e}`);
        }
    }
    else {
        vscode.window.showInformationMessage("Open a folder first to generate your problem in!");
    }
    return dirName;
};
const createFile = (problem, source, id) => {
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
        const output = mustache_1.render(constants_1.TEMPLATE, data);
        fs.writeFileSync(`${normalizedPath}/${dirName}/${fileNameExtension}.md`, output);
        fs.writeFileSync(`${normalizedPath}/${dirName}/${fileNameExtension}.py`, constants_1.PYTHON);
    }
    else {
        // vscode.window.showInformationMessage("Open a folder first to generate your problem in!");
    }
};
exports.deactivate = () => { };
//# sourceMappingURL=extension.js.map