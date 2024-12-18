// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { scanSASTFile, scanAndApplyDiagnostics, setApiToken, getApiToken, resetToken} from './utils/utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sastgemini" is now active!');

    // Register setApiToken command
    const setApi = vscode.commands.registerCommand("sastgemini.setApiToken", () => setApiToken(context));
    // Register getApiToken command
    const getApi = vscode.commands.registerCommand("sastgemini.getApiToken", () => getApiToken(context));
    // Register resetApiToken command
    const resetApi = vscode.commands.registerCommand("sastgemini.resetApiToken", () => resetToken(context));
    // Register scanFile command
    const scanFileDisposable = vscode.commands.registerCommand(
        'sastgemini.scanFile',
        scanSASTFile
    );

	  context.subscriptions.push(scanFileDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
