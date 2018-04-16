import getBestPositions from './getBestPositions';
import getNetwork from './getNetwork';
import getPositionIndex from './getPositionIndex';
import move from './move';
import { equals, any, isNil } from 'ramda';
import { getRandomItem } from 'ptz-math';
import getInputLayer from './getInputLayer';
import getBoardArray from './getBoardArray';

import getInitialGame, {initialGame} from './getInitialGame';
// import moveUserAndAi from '../redux/reducers/moveUserAndAi';
import deepcopy from 'deepcopy';
import moveAi from './moveAi';

console.log('getNetwork()');

/**
 * Neural Network
 */
let net = getNetwork();

/**
 * TODO: Find the best learning rates
 */
const learningRates = {
  invalidMove: 0.6, //0.1,
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
  console.log('getBoardArray:', game);
  const boardArrary = getBoardArray(game); //
  console.log('in propagate, 2nd arg, game target array(outputs):', boardArrary); //[0,0,0,0,0,0,0,1,0]
  net.propagate(learningRate, boardArrary); //(1 or 0.1, 0.6, ), 最新的已下的情形中, 修正的建議落子
}; //game一開始就跑了三次
// 可查a. 之前查的 q-learning, b. alphago. c. 另一個tic-ai, c. enhacne/refornacne training
// rnn
// 問題 1. 重複的move,

const propagate2 = (net, learningRate, index) => {
  console.log('propagate2, target index:', index);
  // const tt = getBoardArray(game); //
  // console.log('in propagate, 2nd arg, game target array(outputs):', tt); //[0,0,0,0,0,0,0,1,0]
  const predict = Array(9).fill(0);
  predict[index]=1;
  console.log('predict:', predict);
  net.propagate(learningRate, predict); //(1 or 0.1, 0.6, ), 最新的已下的情形中, 修正的建議落子
};

export const startTrain = () => {
  console.log('start Train!!!!');

  //1
  let uiGameObj = initialGame;
  // moveUserAndAi(uiGameObj, 隨機index);

  // const position = 0;
  let run = true;
  while(run) {
    console.log('start user+ai run');
    if(uiGameObj.isAiTurn) {
      console.log('wrong1');
      return;
    }
    const bestPositions = getBestPositions(uiGameObj);
    const bestPosition = getRandomItem(bestPositions);
    // const gameAfterBestMove = move(oldGame, bestPosition);
    let gameAfterMove = move(uiGameObj, bestPosition);
    if (isNil(gameAfterMove)) {
      console.log('wrong2');
      return;
    }

    uiGameObj = gameAfterMove;
    if (uiGameObj.ended) {
      console.log('winer:user. auto restart-0-gameAfterMove !!!');
      console.log('final board:', getBoardArray(uiGameObj));

      //TODO: New game. Add it later
      return;
    } else {
      console.log('ask ai move');
      // deep copy
      // worker.postMessage(oldGame);
      const copy = deepcopy(uiGameObj);
      const position = getAiMove(copy);
      console.log('worker return message:');
      const data = deepcopy({
        oldGame: copy,
        position
      });

      // postMessage({
      //   oldGame,
      //   position
      // });
      // return moveAiAndNewGame(state || getInitialGame(), action.data);
      if (!equals(uiGameObj.board, data.oldGame.board)) {
        console.log('wrong3');
        return;
        // return oldGame;
      }
      gameAfterMove = moveAi(uiGameObj, data.position);
      if (isNil(gameAfterMove)) {
        console.log('wrong4');
        return;
        // return oldGame;
      }
      uiGameObj = gameAfterMove;
      if (uiGameObj.ended) {
        console.log('winer:ai. auto start1- new game, ai wins');
        console.log('final board:', getBoardArray(uiGameObj));

        // setTimeout(() => store.dispatch(newGame()), 2*1000);
        //TODO: New game. Add it later
        return;
      }
      // else {
      //   // 重複模擬user輸入
      // }
    }
  }


  // copy post game object到這裡 getAiMove

  // 模擬user ui的行為 100次好了 (ui<->worker, board data用copy)
  // start->user選 or askaimove
  // user 隨機選. ai選, ai選完post回ui的地方要模擬 moveAiAndNewGame->moveAi (<-可能會trigger restart)
  // autostart game

  // 現在是一開始人選接著叫ai動: moveUserAndAi (<-可能會trigger restart)
  // restart game: newGame()-> merge舊的isAiTurn, aiStarted, score, 其他board全新等
  //    可能ai會當第一個, askAiMove(如果aiturn是true)

  console.log('end Train!!!!');
};

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

  // Modified by Grimmer
  const boardArrary = getBoardArray(oldGame);
  const index = getPositionIndex(boardArrary, output); //找最大值所在的index
  console.log('output from network predict: ai index:', index);

  const newGame = move(oldGame, index);

  if (newGame && newGame.ended) {
    propagate2(net, learningRates.win, index);//newGame);
    console.log('train for game ended, ai index:', index);
    return index;

  } else {

    const bestPositions = getBestPositions(oldGame);

    console.log('best Positions:', bestPositions);//可以下的地方
    if (any(p => index === p, bestPositions)) {
      propagate2(net, learningRates.validMove, index);//newGame);
      console.log('train for game, valid move, return ai index:', index);

      return index;

    } else {
      const bestPosition = getRandomItem(bestPositions);
      const gameAfterBestMove = move(oldGame, bestPosition);
      console.log('get newgame by using RandomItem:', bestPosition); //ai先, 我, ai這次就跑到這. 因為不能下上次的位置
      propagate2(net, learningRates.invalidMove, bestPosition);//gameAfterBestMove);

      console.log('train for game, invalid move, return randomPosition:', bestPosition);

      return bestPosition;
    }
  }
};

export default getAiMove;
