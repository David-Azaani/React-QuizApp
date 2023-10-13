function StartScreen({ questionsNumber, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{questionsNumber} questions to test your react mastery</h3>
      <button
        onClick={() => dispatch({ type: 'start' })}
        className="btn btn-ui"
      >
        Lets's Start
      </button>
    </div>
  );
}

export default StartScreen;
