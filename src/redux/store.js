import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';

import thunk from 'redux-thunk';

const store = createStore(rootReducer,
  applyMiddleware(thunk)
  // ,

  /* preloadedState, */

  // window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
