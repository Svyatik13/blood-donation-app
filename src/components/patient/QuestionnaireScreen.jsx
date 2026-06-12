import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function QuestionnaireScreen({ onComplete }) {
  const { submitQuestionnaire, getActiveDonor, t } = useApp();
  const donor = getActiveDonor();

  const questions = [
    { id: 'q1', text: t('q_q1') },
    { id: 'q2', text: t('q_q2') },
    { id: 'q3', text: t('q_q3') },
    { id: 'q4', text: t('q_q4') },
    { id: 'q5', text: t('q_q5') },
    { id: 'q6', text: t('q_q6') },
  ];

  const [answers, setAnswers] = useState({});

  const handleSelect = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (allAnswered) {
      submitQuestionnaire(donor.id, answers);
      onComplete();
    }
  };

  return (
    <div className="mob-content animate-fade-in">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
        {t('q_title')}
      </h2>

      {questions.map((q) => (
        <div className="mob-card mob-question" key={q.id}>
          <div className="mob-question-text">{q.text}</div>
          <div className="mob-question-options">
            <button
              className={`mob-question-opt ${
                answers[q.id] === 'yes' ? 'selected-yes' : ''
              }`}
              onClick={() => handleSelect(q.id, 'yes')}
            >
              {t('q_yes')}
            </button>
            <button
              className={`mob-question-opt ${
                answers[q.id] === 'no' ? 'selected-no' : ''
              }`}
              onClick={() => handleSelect(q.id, 'no')}
            >
              {t('q_no')}
            </button>
          </div>
        </div>
      ))}

      <button
        className="mob-btn mob-btn-primary"
        style={{ marginTop: '1rem' }}
        disabled={!allAnswered}
        onClick={handleSubmit}
      >
        {t('btn_submit_q')}
      </button>
    </div>
  );
}
