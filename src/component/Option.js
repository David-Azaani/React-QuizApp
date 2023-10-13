export default function Option({ options, dispatch, answer, correctOption }) {
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {options.map((op, index) => (
        <button
          className={`btn btn-option    ${
            hasAnswered && (index === answer ? 'answer' : '')
          } ${hasAnswered && (index === correctOption ? 'correct' : 'wrong')} `}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
          key={op}
          disabled={hasAnswered}
        >
          {op}
        </button>
      ))}
    </div>
  );
}
