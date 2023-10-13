import StartAgain from './StartAgain';
function FinishScreen({ points, maxPossiblePoints, lastScore, dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;
  let emoji;
  if (percentage === 100) emoji = '🥇';
  if (percentage >= 80 && percentage < 100) emoji = '🥈';
  if (percentage >= 50 && percentage < 80) emoji = '🥉';
  if (percentage >= 0 && percentage < 50) emoji = '💩';
  if (percentage === 0) emoji = '🤦‍♂️';

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You Scored <strong>{points}</strong> out of{' '}
        {maxPossiblePoints} ({Math.ceil(percentage)}% )
        {/* <p>
          <strong>LastScore : {lastScore}</strong>
        </p> */}
      </p>
      <StartAgain dispatch={dispatch} />
      <p className="highScore">(HighScore: {lastScore} points)</p>
    </>
  );
}

export default FinishScreen;
