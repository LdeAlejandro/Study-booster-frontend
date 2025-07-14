import { useEffect, useState } from "react";
import styles from "./style.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function App() {


   const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  //navigation
  const navigate = useNavigate();

  // Preferences
  const [preferences, setPreferences] = useState([]);
    //update preferences
  useEffect(() => {

    axios
      .get(`${backendUrl}/preferences`)
      .then((response) => {
        setPreferences(response.data);
     
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
      });
  },[preferences, backendUrl] );

  // Pagination and subjects  
    const [subjects, setSubjects] = useState([]);
     const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`${backendUrl}/subjects?page=${page}&size=10`)
      .then(response => {
        const content = response.data.content || [];
        setSubjects(content);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error("Failed to fetch subjects:", error);
      });
  },);

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
      .put(`${import.meta.env.VITE_BACKEND_BASE_URL}/preferences`, updatePref)
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
            <label>Topic</label>
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
      
      <div className={styles.grid}>
        {subjects.map(subject => (
          <button key={subject.id} className={styles.subjectButton} onClick={() => navigate(`/subject/${subject.id}/`)}>
            {subject.subjectName}
          </button>
        ))}
      </div>

      {totalPages > 1 && (
      <div className={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
          ⬅ Prev
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page + 1 === totalPages}>
          Next ➡
        </button>
      </div>
      )}
    </div>
  );
}
