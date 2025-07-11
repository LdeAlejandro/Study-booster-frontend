import React from "react";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import axios from "axios";

export default function App() {
  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/preferences")
      .then((response) => {
        setPreferences(response.data);
     
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
      });
  }, []);

  // update preferences
  const updatePreference = (index, updatedField) => {
    const updatedPreferences = [...preferences];
    const pref = { ...updatedPreferences[index], ...updatedField };

    // Update local preference state
    updatedPreferences[index] = pref;
    setPreferences(updatedPreferences);

    const updatePref = {
      id: pref.id,
      label: pref.label,
      interval: pref.stringInterval,
      subjectId: pref.subjectId,
      moduleId: pref.moduleId,
      lastNotifiedAt: pref.lastNotifiedAt,
    };

    // update on the server
    console.log(updatePref);
    axios
      .put(`http://localhost:8080/preferences`, updatePref)
      .then(() => console.log("Preference updated:", updatePref))
      .catch((error) => console.error("Failed to update preference", error));
  };

  // interval to MS
  function intervalToMs(interval) {
    const minutes = parseInt(interval.replace("min"));
    return minutes * 60 * 1000;
  }

  //interval to String Enum for backend
  function StringIntervalToStringEnum(e) {
    const minutes = parseInt(e.replace("min", ""));
    return `MIN_${minutes}`;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Study Booster</h1>
      <p className={styles.subtitle}>Choose your subjects</p>

      <div className={styles.box}>
        <p className={styles.upTo3}>Up to 3</p>
        {preferences.map((pref, index) => (
          <div key={index} className={styles.row}>
            <label>Subject</label>
            <datalist id={`subjects-${index}`}>
              <option className={styles.subjectButton} value={pref.subjectName}>
                {pref.subjectName}
              </option>
            </datalist>
            <input
              list={`subjects-${index}`}
              className={styles.input}
              defaultValue={pref.subjectName}
              onChange={(e) =>
                updatePreference(index, {
                  subjectName: e.target.value,
                })
              }
            />

            <div>
              <span>{pref.moduleName}</span>
            </div>
            <label>Interval</label>
            <select
              onChange={(e) =>
                updatePreference(index, {
                  stringInterval: StringIntervalToStringEnum(e.target.value),
                  interval: intervalToMs(e.target.value),
                })
              }
            >
              <option className={styles.intervalButton}>
                Actual: {pref.stringInterval.split("_")[1] + "min"}
              </option>
              <option className={styles.intervalButton}>1min</option>
              <option className={styles.intervalButton}>15min</option>
              <option className={styles.intervalButton}>30min</option>
              <option className={styles.intervalButton}>45min</option>
              <option className={styles.intervalButton}>60min</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
