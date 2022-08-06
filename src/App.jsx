import "./App.css";
import StartScreen from "./components/StartScreen";
import { useState, useEffect, useCallback } from "react";
import { wordsList } from "./data/words";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, nome: "start" },
  { id: 2, nome: "game" },
  { id: 3, nome: "end" },
];

const guessesQty = 5;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].nome);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wronLetters, setWronLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = useCallback(() => {
    const categorias = Object.keys(words);
    const categoria =
      categorias[Math.floor(Math.random() * Object.keys(categorias).length)];

    const word =
      words[categoria][Math.floor(Math.random() * words[categoria].length)];

    return { word, categoria };
  }, [words]);

  function clearLetterStates() {
    setGuessedLetters([]);
    setWronLetters([]);
  }

  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, categoria } = pickedWordAndCategory();

    let wordLetter = word.split("");
    wordLetter = wordLetter.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(categoria);
    setLetters(wordLetter);

    setGameStage(stages[1].nome);
  }, [pickedWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizarLetra = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizarLetra) ||
      wronLetters.includes(normalizarLetra)
    ) {
      return;
    }

    if (letters.includes(normalizarLetra)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizarLetra,
      ]);
    } else {
      setWronLetters((actualWronLetters) => [
        ...actualWronLetters,
        normalizarLetra,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();

      setGameStage(stages[2].nome);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].nome
    ) {
      setScore((actualScore) => (actualScore += 100));

      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].nome);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wronLetters={wronLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
