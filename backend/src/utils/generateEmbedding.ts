import ai from "../config/gemini.js";

const generateEmbedding = async (text: string): Promise<number[]> => {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
            outputDimensionality: 768,
        },
    })


    const embedding = response.embeddings?.[0]?.values

    if (!embedding) {
        throw new Error("Failed to generate embedding");
    }

    return embedding;

}
export default generateEmbedding;


// // Testing npx tsx src//.....
// const testEmbedding = async () => {
//     try {
//         const result = await generateEmbedding("React is a JavaScript library");

//         console.log("Embedding:", result);
//         console.log("Vector length:", result.length);
//     } catch (error) {
//         console.error("Embedding error:", error);
//     }
// };

// testEmbedding();