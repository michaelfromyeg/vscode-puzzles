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
const mustache_1 = require("mustache");
// TODO: get this working
// import * as template from "./template.md"
function activate(context) {
    console.log('Congratulations, your extension "extsn" is now active!');
    // Implementation of the command provided with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extsn.getProblem', () => __awaiter(this, void 0, void 0, function* () {
        // vscode.window.showInformationMessage('Running HelloWorld...');
        try {
            const result = yield axios_1.default.post("http://localhost:3000/problem", {
                source: "reddit"
            });
            const text = result.data.problem;
            createFile(text);
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (e) {
            console.error(`Error: ${e}`);
            vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
const createDir = () => {
    const today = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' });
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(today);
    const dirName = `${day}-${month}-${year}`;
    try {
        fs.mkdir(`${__dirname}/${dirName}`, (err) => console.error(err));
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
    return dirName;
};
const createFile = (text) => {
    const dirName = createDir();
    // const template = fs.readFileSync(`./template.md`).toString();
    const template = `# {{ title }} (by Daily Problem)

## from {{ source }}

{{ problem }}
`;
    const data = {
        title: "Reddit Challenge",
        source: "r/dailyprogrammer",
        problem: text,
    };
    // Render template with Mustache
    const output = mustache_1.render(template, data);
    fs.writeFileSync(`${__dirname}/${dirName}/problem.md`, output);
    fs.writeFileSync(`${__dirname}/${dirName}/solution.py`, `# Write your solution here!`);
    return null;
};
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map