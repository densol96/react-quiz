import { useQuizeContext } from "../QuizContext";

const POINTS_PER_QUESTION = 10;

export default function FinishedScreen() {
  const { points: currentPoints, highscore, questions } = useQuizeContext();
  const pointsTotal = questions.length * POINTS_PER_QUESTION;
  const percentage = (currentPoints / pointsTotal) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  else if (percentage >= 80) emoji = "🥈";
  else emoji = "🥉";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{currentPoints}</strong> out of{" "}
        {pointsTotal} ({Math.round(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
    </>
  );
}
