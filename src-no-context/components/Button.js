export default function Button({
  dispatch,
  answer,
  questionIndex,
  questionsTotal,
}) {
  if (answer === null) return null;
  else if (questionIndex < questionsTotal - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'finishQuiz' })}
      >
        Finish
      </button>
    );
  }
}
