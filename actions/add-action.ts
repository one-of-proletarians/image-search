"use server";

import { fileToBase64, uid } from "@/lib/util";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { put } from "@vercel/blob";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

export const addAction = async (formData: FormData) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `make a detailed description of the image with text`,
    });

    const session = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    const file = formData.get("file") as File;
    const description = formData.get("description") as string;

    const base64 = await fileToBase64(file);
    const { response } = await session.sendMessage([
      {
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      },
    ]);
    const imageDescription = response.text();
    const embeddingsResponse = await openai.embeddings.create({
      input: imageDescription,
      model: "text-embedding-3-large",
    });

    const vector = embeddingsResponse.data[0].embedding;

    const { url } = await put("images/" + file.name, file, {
      access: "public",
    });

    pc.index("image-search").upsert([
      {
        id: uid(),
        metadata: {
          imageDescription,
          description,
          url,
        },
        values: vector,
      },
    ]);

    return JSON.stringify({ url });
  } catch (error) {
    return JSON.stringify({ error });
  }
};
