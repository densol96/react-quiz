import { useQuizeContext } from "../QuizContext";

export default function Button() {
  const { dispatch, answer, currentQuestion, questionsTotal } =
    useQuizeContext();
  if (answer === null) return null;
  else if (currentQuestion < questionsTotal - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finishQuiz" })}
      >
        Finish
      </button>
    );
  }
}
