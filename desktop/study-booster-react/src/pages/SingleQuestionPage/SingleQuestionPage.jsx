import React from 'react';
import QuestionComponent from '../subject/module/questions/questionComponent/QuestionComponent';
import styles from './style.module.css';
import { useNavigate } from 'react-router-dom';

const SingleQuestionPage = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const data = JSON.parse(query.get('data') || '{}');

  if (!data || !data.question) {
    return (
      <div>
    <div className={styles.headerButtons}>
      <button onClick={() => navigate("/")} className={styles.homeButton}>🏠 Home</button>
    </div>
    <p>Pergunta não disponível.</p>
    </div>
    );
    
  }

  return (
    <div>
       <div className={styles.headerButtons}>
      <button onClick={() => navigate("/")} className={styles.homeButton}>🏠 Home</button>
    </div>
      <h2>SingleQuestionPage</h2>
      <QuestionComponent question={data} />
    </div>
  );
};

export default SingleQuestionPage;
