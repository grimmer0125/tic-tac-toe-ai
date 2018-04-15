import store from '../store';
import move from '../../ai/move';
import { askAiMove, newGame } from '../actions';
import { isNil } from 'ramda';

/**
 * Move
 *
 * if NOT ended as AI to move
 *
 * if ended create new game and ask ai to move
 * @param {*} oldGame state
 * @param {*} position index in the board to play
 * @return {Object} game
 */
const moveUserAndAi = (oldGame, position) => {

  if (oldGame.isAiTurn) {
    return oldGame;
  }

  const gameAfterMove = move(oldGame, position);

  if (isNil(gameAfterMove)) {
    return oldGame;
  }

  if (gameAfterMove.ended) {
    console.log('auto restart-0-gameAfterMove !!!');
    setTimeout(() => {
      store.dispatch(newGame());
      setTimeout(() => store.dispatch(askAiMove()), 1700);
    }, 2000);
  } else {
    setTimeout(() => {
      store.dispatch(askAiMove());
    }, 1000);
  }

  return gameAfterMove;
};

export default moveUserAndAi;
