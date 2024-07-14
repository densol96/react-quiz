function Question({ question, dispatch, answer, points, questionNum, total }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <div className="options">
        {question.options.map((option, i) => (
          <button
            disabled={answer !== null}
            className={`btn btn-option ${
              answer !== null
                ? i === question.correctOption
                  ? 'correct'
                  : 'wrong'
                : ''
            } ${answer === i ? 'answer' : ''}`}
            key={question.id + i}
            onClick={() => dispatch({ type: 'submitAnswer', payload: i })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
