import setPosition from './setPosition';
import getNewValue from './getNewValue';
import getNClicks from './getNClicks';
import getWinners from './getWinners';
import { isNil } from 'ramda';

const getScore = (oldScore, winners, isMyTurn) => {
  if (winners) {
    return oldScore + (isMyTurn ? 1 : 0);
  }
  else {
    return oldScore;
  }
};

/**
 * Move
 * @param {*} oldGame game
 * @param {Number} index position
 * @return {*} new game
 */
const move = (oldGame, index) => { //people move 也會進來但不會中斷
  // console.log('move-1');
  if (oldGame.ended) {
    console.log('move-end');
    return oldGame;
  }

  const nClicks = getNClicks(oldGame.board);

  const newValue = getNewValue(nClicks);

  const newBoard = setPosition(oldGame.board, index, newValue);

  if (isNil(newBoard)) {
    console.log('move-nil');

    return null;
  }

  const winners = getWinners(newBoard);

  const isNClicksOdd = nClicks % 2 === 0;

  const ended = winners || nClicks > 7 ? true : false;

  const res = {
    board: newBoard,
    ended,
    started: true,
    lastMove: index,
    winners,
    isAiTurn: !oldGame.isAiTurn,
    aiStarted: oldGame.aiStarted,
    score: ended
      ? {
        ai: getScore(oldGame.score.ai, winners, oldGame.aiStarted ? isNClicksOdd : !isNClicksOdd),
        human: getScore(oldGame.score.human, winners, oldGame.aiStarted ? !isNClicksOdd : isNClicksOdd)
      }
      : oldGame.score
  };

  // console.log('move-return:', res);

  return res;
};

export default move;
