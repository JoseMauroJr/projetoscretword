import "./GameOver.css";

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h1>Game Over</h1>
      <h2>
        A Sua pontuação: <span>{score}</span>
      </h2>
      <button onClick={retry}>Reniciar o Jogo!</button>
    </div>
  );
};

export default GameOver;
