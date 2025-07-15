import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./style.module.css";
import { useParams} from "react-router-dom";
import QuestionComponent from "./questionComponent/QuestionComponent";
import { useNavigate } from "react-router-dom";

export default function Questions() {

    //navigation
  const navigate = useNavigate();

    // Get the subjectId from the URL parameters declare in the router
  const { subjectId, moduleId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/subject/${subjectId}/module/${moduleId}/question`)
      .then((res) => {
        const q = res.data.content;
        console.log(res.data.content);
        if (q) setQuestions(q);
      })
      .catch((err) => console.error("Erro ao buscar pergunta:", err));
  }, []);

  if (!questions) return <p>Carregando pergunta...</p>;
  
  return (
    <div className={styles.container}>
       <div className={styles.headerButtons}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>🔙 Back</button>
      <button onClick={() => navigate("/")} className={styles.homeButton}>🏠 Home</button>
    </div>
      {questions.map((question) => (
        <QuestionComponent key={question.id} question={question} />
      ))}
    </div>
    
  );
}
