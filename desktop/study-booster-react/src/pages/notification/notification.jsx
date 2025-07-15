import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './style.module.css';
const query = new URLSearchParams(window.location.search);
const data = JSON.parse(query.get('data') || '{}');

export default function Notification() {

  return (
    
  <div className={styles.container}>
      <div>
        <h4 className={styles.question}>{data.question || "Nova pergunta disponível"}</h4>
        <p className={styles.source}>{data.source_name}</p>
      </div>

      <button
  className={styles.button}
  onClick={() => {
    window.electron?.sendNavigateTo(
      `/SingleQuestion?data=${encodeURIComponent(JSON.stringify(data))}`
    );
    window.close(); // Fecha o popup
  }}
>
  Responder agora
</button>
    </div>
);
} 