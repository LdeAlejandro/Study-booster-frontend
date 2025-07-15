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
        console.log("Preferences fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
      });
  }, []);

  // Pagination and subjects
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [moduleSuggestions, setModuleSuggestions] = useState({});

  // preferences module sugestions
  const fetchModuleSuggestions = (index, query) => {
    if (!query.trim()) return;

    axios
      .get(`${backendUrl}/modules/search?query=${query}`)
      .then((res) => {
        setModuleSuggestions((prev) => ({
          ...prev,
          [index]: res.data,
        }));
      })
      .catch((err) =>
        console.error(`Erro ao buscar módulos para index ${index}:`, err)
      );
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/subjects?page=${page}&size=10`)
      .then((response) => {
        const content = response.data.content || [];
        setSubjects(content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Failed to fetch subjects:", error);
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
      moduleName: pref.moduleName,
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

  // handle module change preference
  const handleModulePreferenceChange = async (index, moduleName) => {
  try {
    const res = await axios.get(`${backendUrl}/modules/search?query=${moduleName}`);
    const suggestions = res.data;

    setModuleSuggestions((prev) => ({
      ...prev,
      [index]: suggestions,
    }));

    const matched = suggestions.find((mod) => mod.name === moduleName.trim());

    updatePreference(index, {
      moduleName,
      moduleId: matched ? matched.id : null,
    });
  } catch (err) {
    console.error("Erro ao buscar sugestões:", err);
  }
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Study Booster</h1>
      <p className={styles.subtitle}>Choose your subjects</p>

      <div className={styles.box}>
        <p className={styles.upTo3}>Up to 3</p>
        {preferences.map((pref, index) => (
          <div key={index} className={styles.row}>
            <label>Topic</label>
            <datalist id={`modules-${index}`}>
              {(moduleSuggestions[index] || []).map((mod) => (
                <option key={mod.id} value={mod.name} />
              ))}
            </datalist>
            <input
              list={`modules-${index}`}
              className={styles.input}
              defaultValue={pref.moduleName || ""}
              onChange={(e) => handleModulePreferenceChange(index, e.target.value)}
            />
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
        {subjects.map((subject) => (
          <button
            key={subject.id}
            className={styles.subjectButton}
            onClick={() => navigate(`/subject/${subject.id}/`)}
          >
            {subject.subjectName}
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            ⬅ Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
