import getAiMove from './ai/getAiMove';

// eslint-disable-next-line
onmessage = (e) => {
  console.log('worker receive onmessage:', e);
  const oldGame = e.data;
  const position = getAiMove(oldGame);

  console.log('worker return message:');
  postMessage({
    oldGame,
    position
  });
};
