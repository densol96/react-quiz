import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Button from "./components/Button";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishScreen";
import Timer from "./components/Timer";

import { useQuizeContext } from "./QuizContext";

export default function App() {
  const { status, dispatch } = useQuizeContext();
  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && <StartScreen />}
          {status === "active" && (
            <>
              <Progress />
              <Question />
              <footer>
                <Timer />
                <Button />
              </footer>
            </>
          )}
          {status === "finished" && (
            <>
              <FinishedScreen />
              <button
                className="btn btn-ui"
                onClick={() => dispatch({ type: "restart" })}
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
