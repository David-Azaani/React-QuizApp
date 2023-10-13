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
import Timer from './Timer';
import Footer from './Footer';
const SECS_PER_QUESTIONS = 1;
const initialState = {
  questions: [],

  // 'loading','error','ready','active','finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  lastScore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error', errorMessage: action.payload };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
      };
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
      return {
        ...state,
        status: 'finished',
        lastScore:
          state.points > state.lastScore ? state.points : state.lastScore,
      };
    case 'restart':
      // return { ...state, status: 'ready', index: 0, points: 0, answer: null };
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        lastScore:
          state.points > state.lastScore ? state.points : state.lastScore,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Fucking Awful Error Broke out!');
  }
}
export default function App() {
  const [
    { questions, status, index, answer, points, lastScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

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
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numberOfQuestions}
              />
            </Footer>
          </>
        )}
        {/* <p>1/15</p>
        <p>Question?</p> */}
        {status === 'finished' && (
          <FinishScreen
            lastScore={lastScore}
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
