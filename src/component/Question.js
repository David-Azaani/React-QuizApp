import Option from './Option';
function Question({ receivedQuestion, dispatch, answer }) {
  const { question, options, correctOption } = receivedQuestion;

  return (
    <div>
      <h4>{question}</h4>
      <Option
        options={options}
        dispatch={dispatch}
        answer={answer}
        correctOption={correctOption}
      />
    </div>
  );
}

export default Question;
