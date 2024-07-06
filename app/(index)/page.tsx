import { Item } from "@/components/Item";
import { Pinecone } from "@pinecone-database/pinecone";
import { del } from "@vercel/blob";

export interface IRecord {
  id: string;
  url: string;
  description: string;
  imageDescription: string;
}

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index("image-search");

export const deleteAction = async (id: string, url: string) => {
  "use server";

  await index.deleteOne(id);
  await del(url);
};

export default async function Home() {
  const { vectors = [] } = await index.listPaginated();
  const ids = vectors.map((v) => v.id);

  if (!ids.length)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-3xl font-bold">No results {ids.toString()}</h1>
      </div>
    );

  const { records } = await index.fetch(ids as string[]);
  const list = Object.values(records).map((r) => ({
    ...r.metadata,
    id: r.id,
  })) as IRecord[];

  return (
    <section>
      {JSON.stringify(ids, null, 2)}
      <ul className="flex flex-col gap-4">
        {list.map((r) => (
          <Item key={r.id} r={r} deleteAction={deleteAction} />
        ))}
      </ul>
    </section>
  );
}
