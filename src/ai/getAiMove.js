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
  debug.log('propagate2, target index:', index);
  // const tt = getBoardArray(game); //
  // console.log('in propagate, 2nd arg, game target array(outputs):', tt); //[0,0,0,0,0,0,0,1,0]
  const predict = Array(9).fill(0);
  predict[index]=1;
  debug.log('predict:', predict);
  net.propagate(learningRate, predict); //(1 or 0.1, 0.6, ), 最新的已下的情形中, 修正的建議落子
};

// from https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
const debug = (function () {
  return {
    log() {
      var args = Array.prototype.slice.call(arguments);
      // console.log(...args);
    },
    warn() {
      var args = Array.prototype.slice.call(arguments);
      console.warn(...args);
    },
    error() {
      var args = Array.prototype.slice.call(arguments);
      console.error(...args);
    }
  };
}());

function startValidation() {
  console.log('start validation');
}

export const startTrain = () => {
  console.log('start train');

  //1
  let uiGameObj = initialGame;
  // moveUserAndAi(uiGameObj, 隨機index);

  // const position = 0;
  const numberOfRounds = 10000;
  let totalInvalid = 0;
  let startTime, endTime;

  console.log('start train, fake user vs ai round: '+numberOfRounds.toString()+' rounds');

  startTime = new Date();
  for (let i=0; i< numberOfRounds; i++) {
    console.log('Round:'+(i+1).toString());
    // console.log('start user+ai run');

    if(uiGameObj.isAiTurn) {
      console.log('ai first');
    } else {
      console.log('user first');
    }

    let run = true;
    let gameAfterMove  = null;
    let numberOfInvalidMove = 0;
    let totalAISteps = 0;
    while(run) {
      if(uiGameObj.isAiTurn) {

        // dlog('new ai step');

        // ai part
        totalAISteps++;
        // worker.postMessage(oldGame);
        const copy = deepcopy(uiGameObj);
        // console.log('new ai step:', copy);

        const resp = getAiMove(copy);
        if (!resp) {
          console.log('wrong5, can not get getAiMove return');
          return;
        }
        const {position, numberOfInvalid} = resp;

        numberOfInvalidMove += numberOfInvalid;
        const data = deepcopy({
          oldGame: copy,
          position
        });
        // console.log('worker return message:', data);
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
          console.log('winer:ai. auto start1- new game');

          // setTimeout(() => store.dispatch(newGame()), 2*1000);
          // [done] TODO: New game. Add it later
          // return;
          run = false;
        }
        // console.log('wrong1');
        // return;
      } else {
        debug.log('new user step');

        // user part
        const bestPositions = getBestPositions(uiGameObj);
        const bestPosition = getRandomItem(bestPositions);
        // const gameAfterBestMove = move(oldGame, bestPosition);
        gameAfterMove = move(uiGameObj, bestPosition);
        if (isNil(gameAfterMove)) {
          console.log('wrong2');
          return;
        }
        uiGameObj = gameAfterMove;
        if (uiGameObj.ended) {
          console.log('winer:user. auto restart-0-gameAfterMove !!!');
          // console.log('final board:', getBoardArray(uiGameObj));

          // [done] TODO: New game. Add it later
          // return;
          run = false;
        }
      }
    } //end of while(true)
    debug.log('final board:', getBoardArray(uiGameObj));
    console.log('invalid:', numberOfInvalidMove, ';per:', numberOfInvalidMove/totalAISteps);
    totalInvalid += numberOfInvalidMove;

    uiGameObj = getInitialGame(uiGameObj);
  }

  endTime = new Date();
  let timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;
  // get seconds
  var seconds = Math.round(timeDiff);
  console.log('train time:', seconds + ' seconds');

  console.log('total:', numberOfRounds, ';score:', uiGameObj.score);
  console.log('total invalid per:', totalInvalid/numberOfRounds);

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
  // const returnData = {position, numberOfInvalid: 0};
  debug.log('getAiMove start, oldGame:', oldGame);
  if (isNil(oldGame)) {
    console.log('getAiMove return1');
    return;
  }

  const input = getInputLayer(oldGame.board); //18個elements, 現在已下的？, array

  const output = net.activate(input); //下一步最佳解. 第一次都接近0.5的array, 9個

  debug.log('input:', input, ';output:', output);

  // Modified by Grimmer
  const boardArrary = getBoardArray(oldGame);
  debug.log('board:', boardArrary);
  const index = getPositionIndex(boardArrary, output); //找最大值所在的index
  debug.log('output from network predict: ai index:', index);


  let position = null;
  let numberOfInvalid = 0;


  // } else {

  const bestPositions = getBestPositions(oldGame);

  debug.log('best Positions:', bestPositions);//可以下的地方
  if (any(p => index === p, bestPositions)) {
    position = index;

    debug.log('train for game, valid move, return ai index:', index);

    // propagate2(net, learningRates.validMove, index);//newGame);
    // return index;

  } else {
    const bestPosition = getRandomItem(bestPositions);

    // const gameAfterBestMove = move(oldGame, bestPosition);

    position = bestPosition;
    debug.log('get newgame by using RandomItem:', bestPosition); //ai先, 我, ai這次就跑到這. 因為不能下上次的位置

    // propagate2(net, learningRates.invalidMove, bestPosition);//gameAfterBestMove);
    debug.log('train for game, invalid move, return randomPosition:', bestPosition);
    numberOfInvalid++;
    // return bestPosition;
  }

  const newGame = move(oldGame, position);
  if (newGame && newGame.ended) {
    propagate2(net, learningRates.win, position);//newGame);
    debug.log('train for game ended, ai index:', position);
    // position = index;
  } else {
    propagate2(net, learningRates.validMove, position);
  }

  return { position, numberOfInvalid };

};

export default getAiMove;
