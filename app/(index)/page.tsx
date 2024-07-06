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
  await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN! });
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { vectors = [] } = await index.listPaginated();
  const ids = vectors.map((v) => v.id);

  if (!ids.length)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-3xl font-bold">No results</h1>
      </div>
    );

  const { records } = await index.fetch(ids as string[]);
  const list = Object.values(records).map((r) => ({
    ...r.metadata,
    id: r.id,
  })) as IRecord[];

  return (
    <section>
      <ul className="flex flex-col gap-4">
        {list.map((r) => (
          <Item key={r.id} r={r} deleteAction={deleteAction} />
        ))}
      </ul>
    </section>
  );
}
