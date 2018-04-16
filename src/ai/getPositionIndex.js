const getPositionIndex = (board, aiOutput) => {
  console.log('board:', board);
  let bestIndex = -1;
  const total = aiOutput.length;
  for (let i=0; i< total;i++) {
    if (board[i] ===0) {
      if (bestIndex === -1){
        bestIndex = i;
      } else if ( aiOutput[i] > aiOutput[bestIndex]) {
        bestIndex = i;
      }
    }
  }
  return bestIndex >-1?bestIndex:0;
};

export default getPositionIndex;
