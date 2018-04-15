import store from '../store';
import getInitialGame from '../../ai/getInitialGame';
import { askAiMove } from '../actions';

const aiStart = (oldGame) => {
  console.log('try aistart:', oldGame); //3 times !!!
  if (oldGame.isAiTurn) {
    setTimeout(() => store.dispatch(askAiMove()), 2000);
  } else {
    console.log('ignore, not ai starts');
  }
  // return getInitialGame(oldGame);
};

export default aiStart;
