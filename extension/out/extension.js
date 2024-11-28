"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const adventOfCode_1 = require("./commands/adventOfCode");
const defaultLanguage_1 = require("./commands/defaultLanguage");
const api_1 = require("./services/api");
const file_1 = require("./services/file");
const logger_1 = require("./utils/logger");
function activate(context) {
    const logger = logger_1.Logger.getInstance();
    const apiService = api_1.ApiService.getInstance();
    const fileService = file_1.FileService.getInstance();
    logger.info("Puzzles extension is now active!");
    const commandHandlers = {
        "extsn.setLanguage": defaultLanguage_1.setDefaultLanguage,
        "extsn.getReddit": () => handleProblemGeneration("reddit"),
        "extsn.getProjectEuler": async () => {
            const id = await vscode.window.showInputBox({
                prompt: "Enter a problem ID (1-784) or leave empty for random",
            });
            await handleProblemGeneration("projectEuler", id);
        },
        "extsn.getCodingBat": () => handleProblemGeneration("codingBat"),
        "extsn.getAdventOfCode": async () => {
            const params = await (0, adventOfCode_1.getAdventOfCodeProblem)();
            if (params) {
                await handleProblemGeneration("adventOfCode", `${params.year}/${params.day}`);
            }
        },
    };
    async function handleProblemGeneration(source, id) {
        try {
            const problem = await apiService.fetchProblem(source, id);
            await fileService.createProblemFiles(problem);
            vscode.window.showInformationMessage("Problem created! Get to solving.");
        }
        catch (error) {
            logger.error("Failed to generate problem", error);
            vscode.window.showErrorMessage("Failed to create problem. Check output for details.");
        }
    }
    // Register commands
    Object.entries(commandHandlers).forEach(([command, handler]) => {
        context.subscriptions.push(vscode.commands.registerCommand(command, handler));
    });
}
function deactivate() {
    logger_1.Logger.getInstance().info("Puzzles extension is now deactivated!");
}
//# sourceMappingURL=extension.js.map