import getAiMove, { startTrain } from './ai/getAiMove';

// eslint-disable-next-line
onmessage = (e) => {
  console.log('worker receive onmessage:', e);
  if (e.data === 'startTrain') {
    console.log('ai receive start train');

    // TODO: Add Training part
    startTrain();
  } else {
    const oldGame = e.data;
    const position = getAiMove(oldGame);

    console.log('worker return message:');
    postMessage({
      oldGame,
      position
    });
  }

};
