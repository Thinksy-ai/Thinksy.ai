export default function FilePreview({ file }: any) {
  if (!file) return null;

  if (file.type === "image") {
    return (
      <img
        src={file.data}
        style={{ maxWidth: 200, borderRadius: 8 }}
      />
    );
  }

  return (
    <div style={{ fontSize: 12 }}>
      📄 {file.name}
    </div>
  );
}
