import getBestPositions from './getBestPositions';
import getNetwork from './getNetwork';
import getPositionIndex from './getPositionIndex';
import move from './move';
import { any, isNil } from 'ramda';
import { getRandomItem } from 'ptz-math';
import getInputLayer from './getInputLayer';
import getBoardArray from './getBoardArray';

/**
 * Neural Network
 */
const net = getNetwork();

/**
 * TODO: Find the best learning rates
 */
const learningRates = {
  invalidMove: 0.1,
  validMove: 0.6,
  win: 1,
  lost: 0
};

/**
 * Propagate neural network with learning rate and right move
 * @sig Net -> Number -> Game -> void
 * @param {Net} net neural network with 9 output neurons
 * @param {Number} learningRate learning rate
 * @param {Game} game game to get the board from
 * @return {void}
 */
const propagate = (net, learningRate, game) => {
  const tt = getBoardArray(game); //
  console.log('in propagate, 2nd arg, game target array(outputs):', tt); //[0,0,0,0,0,0,0,1,0]
  net.propagate(learningRate, tt); //(1 or 0.1, 0.6, ), 最新的已下的情形中, 修正的建議落子
}; //game一開始就跑了三次
// 可查a. 之前查的 q-learning, b. alphago. c. 另一個tic-ai, c. enhacne/refornacne training
// rnn
// 問題 1. 重複的move,

/**
 * Get ai move index position
 * @sig Game -> Number
 * @param {Game} oldGame game
 * @return {Number} position index
 */
const getAiMove = (oldGame) => { //askaimove, 18, 9, 9
  console.log('getAiMove start, oldGame:', oldGame);
  if (isNil(oldGame)) {
    console.log('getAiMove return1');
    return oldGame;
  }

  const input = getInputLayer(oldGame.board); //18個elements, 現在已下的？, array

  const output = net.activate(input); //下一步最佳解. 第一次都接近0.5的array, 9個

  console.log('input:', input, ';output:', output);

  const index = getPositionIndex(output);
  console.log('output from network predict: ai index:', index);

  const newGame = move(oldGame, index);

  if (newGame && newGame.ended) {
    propagate(net, learningRates.win, newGame);
    console.log('train for game ended, ai index:', index);
    return index;

  } else {

    const bestPositions = getBestPositions(oldGame);

    console.log('best Positions:', bestPositions);//可以下的地方
    if (any(p => index === p, bestPositions)) {
      propagate(net, learningRates.validMove, newGame);
      console.log('train for game, valid move, return ai index:', index);

      return index;

    } else {
      const bestPosition = getRandomItem(bestPositions);
      const gameAfterBestMove = move(oldGame, bestPosition);
      console.log('get newgame by using RandomItem:', bestPosition); //ai先, 我, ai這次就跑到這. 因為不能下上次的位置
      propagate(net, learningRates.invalidMove, gameAfterBestMove);

      console.log('train for game, invalid move, return randomPosition:', bestPosition);

      return bestPosition;
    }
  }
};

export default getAiMove;
