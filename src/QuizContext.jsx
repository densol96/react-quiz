import { useContext, useReducer, createContext, useEffect } from "react";
const SECS_PER_QUESTION = 1;

const initialState = {
  questions: [],
  // loading - error - ready - active - finished
  status: "loading",
  currentQuestion: 0,
  answer: null,
  points: 0,
  highscore: +localStorage.getItem("highscore") ?? 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        secondsRemaining: SECS_PER_QUESTION * action.payload.length,
      };
    case "dataFailed":
      return { ...state, questions: [], status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining - 1 <= 0 ? "finished" : state.status,
      };
    case "submitAnswer":
      const currentQuestionData = state.questions[state.currentQuestion];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestionData.correctOption
            ? state.points + currentQuestionData.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        answer: null,
      };
    case "finishQuiz":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...state,
        status: "ready",
        currentQuestion: 0,
        answer: null,
        points: 0,
        secondsRemaining: SECS_PER_QUESTION * state.questions.length,
      };
    default:
      throw new Error("Check the reducer function in App.js..");
  }
}

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const questionsTotal = state.questions.length;
  const pointsTotal = state.questions.reduce(
    (total, question) => total + question.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  function startQuiz() {
    dispatch({ type: "start" });
  }
  const { highscore, questions, currentQuestion } = state;
  const question = questions[currentQuestion];
  useEffect(() => {
    localStorage.setItem("highscore", highscore);
  }, [highscore]);

  return (
    <QuizContext.Provider
      value={{
        ...state,
        dispatch,
        startQuiz,
        question,
        questionsTotal,
        pointsTotal,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuizeContext() {
  return useContext(QuizContext);
}

export { QuizProvider, useQuizeContext };
