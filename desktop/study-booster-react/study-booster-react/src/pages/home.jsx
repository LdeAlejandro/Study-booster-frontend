import React from "react";
import styles from  "./style.module.css";


const preferences = [
  { subject: "C#", interval: "15min" },
  { subject: "C#", interval: "30min" },
  { subject: "C#", interval: "60min" },
];

export default function App() {
  return (
      <div className={styles.container}>
      <h1 className={styles.title}>Study Booster</h1>
      <p className={styles.subtitle}>Choose your subjects</p>

      <div className={styles.box}>
        <p className={styles.upTo3}>Up to 3</p>
        {preferences.map((pref, index) => (
          <div key={index} className={styles.row}>
            <button className={styles.subjectButton}>{pref.subject}</button>
            <button className={styles.intervalButton}>{pref.interval}</button>
          </div>
        ))}
      </div>
    </div>
  );
}


