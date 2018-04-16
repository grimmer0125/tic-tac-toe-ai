import move from './move';
import { isNil } from 'ramda';

/**
 * Move AI if:
 * - Game is not null
 * - Is AI turn
 * @param {*} oldGame game
 * @param {*} position index position
 * @return {*} new game
 */
const moveAi = (oldGame, position) => {
  // console.log('moveAi');
  if (isNil(oldGame) || !oldGame.isAiTurn) {
    console.log('ignore move');
    return oldGame;
  }

  return move(oldGame, position);
};

export default moveAi;
