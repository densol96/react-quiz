// import DateCounter from './DateCounter';
import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';

const initialState = {
  questions: [],
  // loading - error - ready - active - finished
  status: 'loading',
  currentQuestion: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, questions: [], status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
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
    default:
      throw new Error('Check the reducer function in App.js..');
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, currentQuestion, answer, points } = state;
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
              <NextButton dispatch={dispatch} answer={answer} />
            </>
          )}
        </Main>
      </div>
    </>
  );
}
