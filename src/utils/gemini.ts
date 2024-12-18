import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as dotenv from "dotenv";
import * as vscode from 'vscode';
import {
    SAST_PROMPT,
} from "../prompt";
const prompt = require('./prompt.json');

export async function doSASTScan(context: vscode.ExtensionContext, text: string) {
    // const config = vscode.workspace.getConfiguration('sastgemini');
    // const geminiKey = config.get('apiKey');
    const geminiKey = context.globalState.get('apiToken');
    console.error(geminiKey);

    // Prepend line numbers to the input text
    const numberedText = text.split('\n').map((line, index) => `${index + 1}: ${line}`).join('\n');
    const genAI = new GoogleGenerativeAI(geminiKey as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const finalSASTPrompt = SAST_PROMPT(
        prompt.fortify_audit_expert.cmd,
        prompt.fortify_audit_expert.Act,
        prompt.fortify_audit_expert.Prompt,
        numberedText
    );

    const result = await model.generateContent(finalSASTPrompt);

    const parsedResponse = JSON.parse(result.response.text());

    return parsedResponse;

};
