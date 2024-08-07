import { useQuizeContext } from "../QuizContext";

function StartScreen() {
  const { numOfQuestions, startQuiz } = useQuizeContext();
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numOfQuestions} question to test your React mastery</h3>
      <button onClick={startQuiz} className="btn btn-ui">
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
