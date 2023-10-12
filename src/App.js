import { useEffect, useReducer } from 'react';
import Headers from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';

const initialState = {
  questions: [],

  // 'loading','error','ready','active','finished'
  status: 'loading',
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error', errorMessage: action.payload };
    default:
      throw new Error('Fucking Awful Error Broke out!');
  }
}
export default function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  // const [state, dispatch] = useReducer(reducer, initialState);
  // const { questions, status } = state;
  const numberOfQuestions = questions.length ?? 0;
  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed', payload: err.message }));
  }, []);

  return (
    <div className="app">
      <Headers />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen questionsNumber={numberOfQuestions} />
        )}

        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}
