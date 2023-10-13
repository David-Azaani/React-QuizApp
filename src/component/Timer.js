import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  // const [timer, setTimer] = useState(0);
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        // console.log('tik');
        //setTimer((cu) => cu + 1);
        dispatch({ type: 'tick' });
      }, 1000);

      return () => clearInterval(id); // the most used of using cleaning operation in useEffect is here!
    },
    [dispatch]
  );
  //return <div className="timer">{timer}</div>;
  return (
    <div className="timer">
      {mins < 10 && '0'}
      {mins}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
}

export default Timer;
