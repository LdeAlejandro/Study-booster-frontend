import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./style.module.css";

const Subject = () => {

   const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  // Get the subjectId from the URL parameters declare in the router
  const { subjectId } = useParams();

  //get params from current url
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get("parentId");
  //navigation
  const navigate = useNavigate();

  // api data store
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  // pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [docs, setDocs] = useState([]);
  const [hasQuestions, setHasQuestions] = useState(false);

  // submodules data
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/subject/${subjectId}/module/parent?parentId=${parentId}&page=0&size=10`
      )
      .then((response) => {
        const content = response.data.content || [];
        setModules(content);
        console.log(content);
        setCurrentModule(content.length > 0 ? content[0].id : null); // set current module id
        setDocs(content.length > 0 && content[0].docs?.length > 0 ? content[0].docs : []); // check if this module has docs
        setHasQuestions(content.length > 0 && content[0].questionIds?.length > 0); // check if this module has questions
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Failed to fetch modules:", error);
      });
  }, [page, subjectId, parentId, backendUrl]);

  return (
    
    <div className={styles.container}>
      <div className={styles.headerButtons}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>🔙 Back</button>
      <button onClick={() => navigate("/")} className={styles.homeButton}>🏠 Home</button>
    </div>
      <h1 className={styles.title}>Modules</h1>
      <p className={styles.subtitle}>Choose your module</p>
      <div className={styles.grid}>
        {modules.map((module) => (
          <button
            key={module.id}
            className={styles.subjectButton}
            onClick={() =>
              navigate(
                `/subject/${subjectId}/module/parent?parentId=${module.id}&page=0&size=10`
              )
            }
          >
            {module.name}
          </button>
        ))}
      </div>

     
        <div className={styles.grid}>
          {docs.length > 0 &&
            docs.map((doc) => (
              <button
                key={doc.id}
                className={styles.subjectButton}
                onClick={() => navigate(`/subject/${subjectId}/module/${currentModule}/doc/${doc.id}`)}
              >
                Doc {doc.title}
              </button>
            ))}
        </div>
     

      {hasQuestions && (
       
          <div className={styles.grid}>
            <button
              className={styles.subjectButton}
              onClick={() => navigate(`/subject/${subjectId}/module/${currentModule}/question`)}>
                Questions
            </button>
          </div>
       
      )}

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
};

export default Subject;
