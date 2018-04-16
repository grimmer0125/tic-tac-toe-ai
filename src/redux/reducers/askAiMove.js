import store from '../store';
import { aiMove } from '../actions';
// import getAiMove from '../../ai/getAiMove';
import { isNil } from 'ramda';

// eslint-disable-next-line
const AiWorker = require('worker-loader!../../aiWorker.js');
let worker = null;

if (typeof Worker === 'undefined') {
  console.log('Sorry! No Web Worker support');
  worker = null;
} else {
  // Yes! Web worker support!
  worker = new AiWorker();
  console.log('new ai worker');

  worker.onmessage = (m) => {
    console.log('ui thread receive onmessage-1');
    store.dispatch(aiMove(m.data));
  };
}

export const askAIStartTrain = () => {
  worker.postMessage('startTrain');
};

const askAiMove = (oldGame) => {
  if (isNil(worker)) {
    console.log('askAiMove-directly call');;

    // const position = getAiMove(oldGame);
    // store.dispatch(aiMove({
    //   oldGame,
    //   position
    // }));
  } else {
    console.log('askAiMove-ai worker post message');;
    worker.postMessage(oldGame);
  }

  return oldGame;
};

export default askAiMove;
