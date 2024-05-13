// import DateCounter from './DateCounter';
import { useEffect, useReducer } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import Button from './components/Button';
import Progress from './components/Progress';
import FinishedScreen from './components/FinishScreen';
import Timer from './components/Timer';

const SECS_PER_QUESTION = 15;

const initialState = {
  questions: [],
  // loading - error - ready - active - finished
  status: 'loading',
  currentQuestion: 0,
  answer: null,
  points: 0,
  highscore: +localStorage.getItem('highscore') ?? 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
        secondsRemaining: SECS_PER_QUESTION * action.payload.length,
      };
    case 'dataFailed':
      return { ...state, questions: [], status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    case 'tick':
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };
    case 'submitAnswer':
      const currentQuestionData = state.questions[state.currentQuestion];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestionData.correctOption
            ? state.points + currentQuestionData.points
            : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        answer: null,
      };
    case 'finishQuiz':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...state,
        status: 'ready',
        currentQuestion: 0,
        answer: null,
        points: 0,
        secondsRemaining: SECS_PER_QUESTION * state.questions.length,
      };
    default:
      throw new Error('Check the reducer function in App.js..');
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    currentQuestion,
    answer,
    points,
    highscore,
    secondsRemaining,
  } = state;
  const questionsTotal = questions.length;
  const pointsTotal = questions.reduce(
    (total, question) => total + question.points,
    0
  );

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  useEffect(() => {
    localStorage.setItem('highscore', highscore);
  }, [highscore]);

  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === 'loading' && <Loader />}
          {status === 'error' && <Error />}
          {status === 'ready' && (
            <StartScreen
              startQuiz={() => dispatch({ type: 'start' })}
              numOfQuestions={questions.length}
            />
          )}
          {status === 'active' && (
            <>
              <Progress
                index={currentQuestion}
                questionsTotal={questionsTotal}
                currentPoints={points}
                pointsTotal={pointsTotal}
                answer={answer}
              />
              <Question
                question={questions[currentQuestion]}
                dispatch={dispatch}
                answer={answer}
              />
              <footer>
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
                <Button
                  dispatch={dispatch}
                  answer={answer}
                  questionIndex={currentQuestion}
                  questionsTotal={questionsTotal}
                />
              </footer>
            </>
          )}
          {status === 'finished' && (
            <>
              <FinishedScreen
                currentPoints={points}
                pointsTotal={pointsTotal}
                highscore={highscore}
                dispatch={dispatch}
              />
              <button
                className="btn btn-ui"
                onClick={() => dispatch({ type: 'restart' })}
              >
                Restart
              </button>
            </>
          )}
        </Main>
      </div>
    </>
  );
}
