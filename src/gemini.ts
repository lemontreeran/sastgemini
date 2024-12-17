import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as dotenv from "dotenv";
import {
    SAST_PROMPT,
} from "../prompt";
const vscode = require('vscode');
const prompt = require('./prompt.json');

const doSASTScan(text) => {
    const config = vscode.workspace.getConfiguration('chatgpt-code-analyzer');
    const geminiKey = config.get('apiKey');
    console.error(geminKey);

    // Prepend line numbers to the input text
    const numberedText = text.split('\n').map((line, index) => `${index + 1}: ${line}`).join('\n');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const finalSASTPrompt = SAST_PROMPT(
        prompt.fortify_audit_expert.cmd,
        prompt.fortify_audit_expert.Act,
        prompt.fortify_audit_expert.Prompt
    );

    const result = await model.generateContent(finalPrompt);

    const parsedResponse = JSON.parse(result.response.text());

    return parsedResponse;

};

module.exports = doSASTScan;
