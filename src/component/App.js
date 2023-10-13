import { useEffect, useReducer } from 'react';
import Headers from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';

const initialState = {
  questions: [],

  // 'loading','error','ready','active','finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error', errorMessage: action.payload };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'newQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      return { ...state, status: 'finished' };
    default:
      throw new Error('Fucking Awful Error Broke out!');
  }
}
export default function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numberOfQuestions = questions.length ?? 0;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const { questions, status } = state;
  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed', payload: err.message }));
  }, []);
  // function handleStart() {
  //   dispatch({ type: 'start' });
  // }
  return (
    <div className="app">
      <Headers />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
            questionsNumber={numberOfQuestions}
            // onClick={handleStart}
            dispatch={dispatch}
          />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestion={numberOfQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              receivedQuestion={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />

            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numberOfQuestions}
            />
          </>
        )}
        <p>1/15</p>
        <p>Question?</p>
        {status === 'finished' && (
          <FinishScreen maxPossiblePoints={maxPossiblePoints} points={points} />
        )}
      </Main>
    </div>
  );
}
