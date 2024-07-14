import { useQuizeContext } from "../QuizContext";

export default function Progress() {
  const {
    currentQuestion,
    questionsTotal,
    currentPoints,
    pointsTotal,
    answer,
  } = useQuizeContext();
  return (
    <header className="progress">
      {/* want value to start at 0 */}
      <progress
        max={questionsTotal}
        value={currentQuestion + Number(answer)}
      ></progress>
      <p>
        Question <strong>{currentQuestion + 1}</strong>/{questionsTotal}
      </p>
      <p>
        Points <strong>{currentPoints}</strong>/{pointsTotal}
      </p>
    </header>
  );
}
