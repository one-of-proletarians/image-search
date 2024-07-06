import { Item } from "@/components/Item";
import { Pinecone } from "@pinecone-database/pinecone";
import { redirect } from "next/navigation";
import OpenAI from "openai";
import { deleteAction } from "../(index)/page";

interface Props {
  searchParams: { q: string };
}

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Search({ searchParams }: Props) {
  const input = searchParams.q;
  if (!input) {
    redirect("/");
  }
  try {
    const { data } = await openai.embeddings.create({
      input,
      model: "text-embedding-3-large",
    });

    const index = pc.index("image-search");
    const vector = data[0].embedding;
    const results = await index.query({
      vector,
      topK: 10,
      includeMetadata: true,
    });

    return (
      <div>
        <ul className="flex flex-col gap-4">
          {results.matches.map((r) => (
            <Item
              key={r.id}
              // @ts-ignore
              r={{ id: r.id, ...r.metadata }}
              deleteAction={deleteAction}
            />
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.log(error);
  }

  return <div>Search: {searchParams.q}</div>;
}
