import ai from "../config/gemini.js";

interface GenerateAnswerParams {
    question: string;
    context: string;
}

const generateAnswer = async ({
    question,
    context,
}: GenerateAnswerParams): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
      Context:
      ${context}

      User Question:
      ${question}
    `,
        config: {
            systemInstruction: `
        You are an AI Document Assistant.

        Answer the user's question using only the
        information provided in the context.

        If the answer is not available in the context,
        clearly say that the uploaded documents do not
        contain enough information to answer.

        Do not make up information.
      `,
        },
    });

    const answer = response.text;

    console.log('answer :>> ', answer);
    if (!answer) {
        throw new Error("Failed to generate AI answer");
    }

    return answer;
};

export default generateAnswer;


// const testGenerateAnswer = async () => {

//     try {
//         const answer = await generateAnswer({
//             question: "What is React?",
//             context: `
//         React is a JavaScript library used
//         for building user interfaces.
//         It uses reusable components.
//       `,
//         });

//         console.log("AI Answer:", answer);
//     } catch (error) {
//         console.error("AI Error:", error);
//     } finally {
//     }
// };

// testGenerateAnswer();