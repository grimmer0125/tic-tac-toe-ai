import aiStart from './aiStart';
import moveAiAndNewGame from './moveAiAndNewGame';
import moveUserAndAi from './moveUserAndAi';
import askAiMove from './askAiMove';
import { actions } from '../actions';
import getInitialGame, {initialGame} from '../../ai/getInitialGame';

const game = (state=initialGame, action) => {
  switch (action.type) {
    case actions.NEW_GAME:
      // return aiStart(state);
      const newState = getInitialGame(state);
      aiStart(newState);
      return newState;
    case actions.SELECT_POSITION:
      return moveUserAndAi(state, action.index);
    case actions.ASK_AI_MOVE:
      console.log('action-ASK_AI_MOVE');
      return askAiMove(state || getInitialGame());
    case actions.AI_MOVE:
      return moveAiAndNewGame(state || getInitialGame(), action.data);
    default:
      console.log('ai default in reducer');
      return state; //|| aiStart();
  }
};

export {
  game
};
