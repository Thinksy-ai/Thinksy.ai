import { fileToBase64 } from "@/lib/files/fileToBase64";
import { readFile } from "@/lib/files/readFile";

export default function FileUpload({ onFile }: any) {
  const handle = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image")) {
      const base64 = await fileToBase64(file);

      onFile({
        type: "image",
        data: base64,
        name: file.name,
      });
    } else {
      const text = await readFile(file);

      onFile({
        type: "text",
        data: text,
        name: file.name,
      });
    }
  };

  return <input type="file" onChange={handle} />;
}
