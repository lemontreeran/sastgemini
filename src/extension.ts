// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export const disposable = vscode.commands.registerTextEditorCommand('code-tutor.annotate', async (textEditor: vscode.TextEditor) => {

	// Get the code with line numbers from the current editor
	const codeWithLineNumbers = getvisiblecodewithlinenumbers(textEditor);

	// select the 4o chat model
	const [model] = await vscode.lm.selectChatModels({
		vendor: 'copilot',
		family: 'gpt-4o',
	});

	// init the chat message
	const messages = [
		vscode.LanguageModelChatMessage.User(ANNOTATION_PROMPT),
		vscode.LanguageModelChatMessage.User(codeWithLineNumbers),
	];

	// make sure the model is available
	if (model) {

		// send the messages array to the model and get the response
		const chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

		// handle chat response
		await parseChatResponse(chatResponse, textEditor);
	}
});

async function parseChatResponse(chatResponse: vscode.LanguageModelChatResponse, textEditor: vscode.TextEditor) {
	let accumulatedResponse = "";

	for await (const fragment of chatResponse.text) {
		accumulatedResponse += fragment;

		// if the fragment is a }, we can try to parse the whole line
		if (fragment.includes("}")) {
			try {
				const annotation = JSON.parse(accumulatedResponse);
				applyDecoration(textEditor, annotation.line, annotation.suggestion);
				// reset the accumulator for the next line
				accumulatedResponse = "";
			}
			catch {
				// do nothing
			}
		}
	}
}

function getVisibleCodeWithLineNumbers(textEditor: vscode.TextEditor) {
	// get the position of the first and last visible lines
	let currentLine = textEditor.visibleRanges[0].start.line;
	const endLine = textEditor.visibleRanges[0].end.line;

	let code = '';

	// get the text from the line at the current position.
	// The line number is 0-based, so we add 1 to it to make it 1-based.
	while (currentLine < endLine) {
		code += `${currentLine + 1}: ${textEditor.document.lineAt(currentLine).text} \n`;
		// move to the next line position
		currentLine++;
	}
	return code;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sastgemini" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('sastgemini.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from SASTGemini!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
