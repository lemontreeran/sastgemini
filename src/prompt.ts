export const SAST_PROMPT = (
  cmd: string,
  Act: string,
  Prompt: string
) =>
  `
    cmd:
    ${cmd}

    Act:
    ${Act}

    Prompt:
    ${Prompt}

    Format of Response:
    {
        line: <line>,
        suggestion: <suggestion>
    }

    You must return the response in JSON format like the example above.
`;
