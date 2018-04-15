import store from '../store';
import getInitialGame from '../../ai/getInitialGame';
import { askAiMove } from '../actions';

const aiStart = (oldGame) => {
  console.log('aistart'); //3 times !!!
  setTimeout(() => store.dispatch(askAiMove()), 2000);
  // return getInitialGame(oldGame);
};

export default aiStart;
