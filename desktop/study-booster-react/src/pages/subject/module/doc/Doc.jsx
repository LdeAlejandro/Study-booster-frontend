import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

export default function Doc() {

  const navigate = useNavigate();
  const { moduleId, docId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const [doc, setDoc] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/module/${moduleId}/doc/${docId}`)
      .then((res) => res.json())
      .then((data) => {
        setDoc(data.doc);
        setMarkdown(data.doc.content);
      })
      .catch((err) => console.error("Erro ao buscar doc:", err));
  }, [backendUrl, moduleId, docId]);

  // save button
  const handleSave = () => {
    setSaving(true);
    fetch(`${backendUrl}/module/${moduleId}/doc/${docId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: doc.title,
        content: markdown,
      }),
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch((err) => console.error("Erro ao salvar doc:", err))
      .finally(() => setSaving(false));
  };

  //save and update doc on page close
  useEffect(() => {
  const handleBeforeUnload = () => {
    if (doc && markdown !== doc.content) {
      fetch(`${backendUrl}/module/${moduleId}/doc/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: doc.title,
          content: markdown,
        }),
        keepalive: true, // 🔥 mantém a requisição ativa mesmo saindo da página
      });
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [doc, markdown, backendUrl, moduleId, docId]);
  

  if (!doc) return <p>Carregando documento...</p>;

  return (
    <div className={styles.container}>
       <div className={styles.headerButtons}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>🔙 Back</button>
      <button onClick={() => navigate("/")} className={styles.homeButton}>🏠 Home</button>
    </div>
      <h1 className={styles.title}>{doc.title}</h1>

     <MDEditor
  value={markdown}
  onChange={setMarkdown}
  preview="preview"
  fullscreen={true}
  theme="dark"
  height="80vh"
/>

<button onClick={handleSave} disabled={saving} className={styles.saveButton}>
  {saving ? "Salvando..." : saved ? "✔ Salvo!" : "💾 Salvar"}
</button>
     
    </div>
  );
}
