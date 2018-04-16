import getAiMove, { startTrain } from './ai/getAiMove';

// eslint-disable-next-line
onmessage = (e) => {
  console.log('worker receive onmessage:', e);
  if (e.data === 'startTrain') {
    console.log('ai receive start train');

    startTrain();
  } else {
    const oldGame = e.data;
    const resp = getAiMove(oldGame);

    if (resp) {
      console.log('worker return message:');

      postMessage({
        oldGame,
        position: resp.position
      });
    } else {
      console.log('worker has something wrong');
    }
  }

};
