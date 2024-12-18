import * as vscode from 'vscode';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
const diagnosticCollection = vscode.languages.createDiagnosticCollection('sastgemini');
import { doSASTScan } from './gemini';

export async function scanSASTFile() {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Please open a file to analyze.');
            return;
        }

        const text = editor.document.getText();
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Analyzing file for security vulnerabilities',
                cancellable: false,
            },
            async () => {
                try {
                    await scanAndApplyDiagnostics(editor.document.uri.fsPath, text);
                }
                catch (error) {
                    console.error(error);
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                }
            }
        );
    } catch(error) {
        console.error(error);

    }
}

export async function scanAndApplyDiagnostics(filePath, text) {
    try {
        const result = await doSASTScan(text);
        // Parse the result and create diagnostics
        const diagnostics = [];
        const scanResults = JSON.parse(text);
        if (Array.isArray(suggestions)) {
            for (const scanResult of scanResults) {
                const lineNumber = scanResult.line - 1; // convert to 0-based index

                // Calculate the range using the line number
                const startPos = new vscode.Position(lineNumber, 0);
                const endPos = new vscode.Position(lineNumber, text.split('\n')[lineNumber].length);
                const range = new vscode.Range(startPos, endPos);

                const diagnostic = new vscode.Diagnostic(
                    range,
                    message,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostics.push(diagnostic);
        }

        // Show the diagnostics in the editor
        const fileUri = vscode.Uri.file(filePath);
        diagnosticCollection.set(fileUri, diagnostics);
    } catch (error) {
        console.error(`Error analyzing ${filePath}: ${error.message}`);
    }
}

export async function setApiToken(context: vscode.ExtensionContext) {

    try {
        const token = await vscode.window.showInputBox({
            title: "Insert the AI Token",
            prompt: "Insert your Api Token to proceed",
            password: true,
            placeHolder: ""
        });

        if (token) {
            await context.globalState.update('apiToken', token);
            vscode.window.showInformationMessage("API token set succesfully!");
        }
        else {
            vscode.window.showWarningMessage("API token setting was cancelled!");
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error on setting API Token: ${error.message}`);
    }


}

export function getApiToken(context: vscode.ExtensionContext) {
    const token = context.globalState.get('apiToken');

    if (token) {
        vscode.window.showInformationMessage(`Your API Token is:${token}`);
    }
    else {
        vscode.window.showWarningMessage("You haven't set your API. Please set it first!");
    }
}

export async function resetToken(context: vscode.ExtensionContext) {
    await context.globalState.update('apiToken', undefined);
    vscode.window.showInformationMessage("Api token was removed");
}
