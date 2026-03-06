import React from 'react';

const QuestionDialog = ({ question, onAnswer, selectedOption }) => {
  return (
    <div className="question-dialog">
      <h2>🎯 Answer the Question!</h2>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedOption === option
                ? option === question.correctAnswer
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => onAnswer(option)}
            disabled={selectedOption !== null}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDialog;
