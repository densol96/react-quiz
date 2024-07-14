export default function Progress({
  index,
  questionsTotal,
  currentPoints,
  pointsTotal,
  answer,
}) {
  return (
    <header className="progress">
      {/* want value to start at 0 */}
      <progress max={questionsTotal} value={index + Number(answer)}></progress>
      <p>
        Question <strong>{index + 1}</strong>/{questionsTotal}
      </p>
      <p>
        Points <strong>{currentPoints}</strong>/{pointsTotal}
      </p>
    </header>
  );
}
