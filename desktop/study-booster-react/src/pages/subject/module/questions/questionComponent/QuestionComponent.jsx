import React, { useState } from "react";
import styles from "./style.module.css";

export default function QuestionComponent({ question }) {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleClick = (opt) => {
    setSelected(opt.id);
    setShowExplanation(true);
  };

  if (!question) return <p>Pergunta não disponível.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{question.question}</h2>
      <div className={styles.options}>
        {question.options.map((opt) => {
          const isCorrect = opt.correct;
          const isSelected = selected === opt.id;

          let className = styles.option;
          if (showExplanation) {
            if (isCorrect) className += ` ${styles.correct}`;
            else if (isSelected) className += ` ${styles.wrong}`;
          }

          return (
            <button
              key={opt.id}
              className={className}
              onClick={() => handleClick(opt)}
              disabled={showExplanation}
            >
              {opt.option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={styles.explanation}>
          <strong>Explanation:</strong> {question.answerExplanation}
        </div>
      )}
        <br />
      <br />
      <hr />
    </div>
  );
}
