import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import styles from './style.module.css';

const Subject = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  // Get the subjectId and depth from the URL parameters declare in the router
  const { subjectId } = useParams();


  //navigation
  const navigate = useNavigate();

  // Pagination and subjects
  const [modules, setModules] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`${backendUrl}/subject/${subjectId}/module/parent?page=0&size=10`)
      .then(response => {
        const content = response.data.content || [];
        setModules(content);
        setTotalPages(response.data.totalPages);
        console.log("total pages", response.data.totalPages);
      })
      .catch(error => {
        console.error("Failed to fetch modules:", error);
      });
  }, [page, subjectId, backendUrl]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modulesasdsadasdsa</h1>
            <p className={styles.subtitle}>Choose your module</p>
        <div className={styles.grid}>
              {modules.map(module => (
                console.log("module", module),
                <button key={module.id} className={styles.subjectButton} onClick={() => navigate(`/subject/${subjectId}/module/parent?parentId=${module.id}`)}>
                  {module.name}
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
  )
}

export default Subject