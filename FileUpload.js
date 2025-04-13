import { useState } from "react";

function FileUpload({ onDataReady }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:4040/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    onDataReady(data);
  };

  return (
    <div className="upload-section">
      <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Generate Mind Map</button>
    </div>
  );
}

export default FileUpload;
