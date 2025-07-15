import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./style.module.css";
import { useParams} from "react-router-dom";
import QuestionComponent from "./questionComponent/QuestionComponent";

export default function Questions() {

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

      {questions.map((question) => (
        <QuestionComponent key={question.id} question={question} />
      ))}
    </div>
    
  );
}
