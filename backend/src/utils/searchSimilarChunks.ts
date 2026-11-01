import mongoose from "mongoose";
import Chunk from "../models/Chunk.js";
import generateEmbedding from "./generateEmbedding.js";

const searchSimilarChunks = async (
    query: string,
    userId: string,
    documentId: string
) => {
    const queryEmbedding = await generateEmbedding(query);

    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: "chunk_vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 5,
                filter: {
                    $and: [
                        {
                            userId: {
                                $eq: new mongoose.Types.ObjectId(userId),
                            },
                        },
                        {
                            documentId: {
                                $eq: new mongoose.Types.ObjectId(documentId),
                            },
                        },
                    ],
                },
            },
        },
        {
            $project: {
                content: 1,
                documentId: 1,
                chunkIndex: 1,
                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },
    ]);

    return results;
};

export default searchSimilarChunks;