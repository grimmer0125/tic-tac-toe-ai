import store from '../store';
import moveAi from '../../ai/moveAi';
import { newGame } from '../actions';
import { equals, isNil } from 'ramda';

const moveAiAndNewGame = (oldGame, data) => {
  console.log('action moveAiAndNewGame');
  if (!equals(oldGame.board, data.oldGame.board)) {
    return oldGame;
  }

  const gameAfterMove = moveAi(oldGame, data.position);

  if (isNil(gameAfterMove)) {
    return oldGame;
  }

  if (gameAfterMove.ended) {
    console.log('auto start1- new game');
    setTimeout(() => store.dispatch(newGame()), 2*1000);
  }

  return gameAfterMove;
};

export default moveAiAndNewGame;
