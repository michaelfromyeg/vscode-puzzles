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
const constants_1 = require("./constants");
const html_entities_1 = require("html-entities");
// TODO: get this working
// import * as template from "./template.md"
exports.activate = (context) => {
    console.log("Daily Problem is now active!");
    const reddit = vscode.commands.registerCommand('extsn.getReddit', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield generateProblem("reddit");
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (e) {
            console.error(`Error: ${e}`);
            vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
        }
    }));
    const projectEuler = vscode.commands.registerCommand('extsn.getProjectEuler', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield generateProblem("projectEuler");
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (e) {
            console.error(`Error: ${e}`);
            vscode.window.showInformationMessage("Sorry, there was an error in creating your problem today :/");
        }
    }));
    const codingBat = vscode.commands.registerCommand('extsn.getCodingBat', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield generateProblem("codingBat");
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
const generateProblem = (source) => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield textFromSource(source);
    createFile(text, source);
});
const textFromSource = (source) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield axios_1.default.post(`${constants_1.BASE_URL}/problem`, {
        source: source
    });
    return result.data.problem;
});
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
const createFile = (text, source) => {
    const dirName = createDir();
    // const template = fs.readFileSync(`./template.md`).toString();
    const entities = new html_entities_1.AllHtmlEntities();
    const markdown = entities.decode(text);
    console.log('md', markdown);
    const data = {
        title: "Daily Problem",
        source: source,
        problem: markdown,
    };
    const fileNameExtension = source.toLowerCase();
    // Render template with Mustache
    const output = mustache_1.render(constants_1.TEMPLATE, data);
    fs.writeFileSync(`${__dirname}/${dirName}/problem-${fileNameExtension}.md`, output);
    fs.writeFileSync(`${__dirname}/${dirName}/solution-${fileNameExtension}.py`, constants_1.PYTHON);
};
exports.deactivate = () => { };
//# sourceMappingURL=extension.js.map