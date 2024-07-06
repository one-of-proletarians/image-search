export async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes).toString("base64");
}

export const uid = () => Math.random().toString(36).substring(2);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
