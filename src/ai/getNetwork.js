import { Network, Layer } from 'synaptic';

// let net2 = null;

/**
 * Get AI Neural Network
 * @return {*} Neural Network
 */
const getNetwork = () => {
  console.log('init network');
  // if (!net2) {
  console.log('new network');

  const inputLayer = new Layer(18);
  const hiddenLayer = new Layer(9);
  const outputLayer = new Layer(9);

  inputLayer.project(hiddenLayer);
  hiddenLayer.project(outputLayer);

  return  new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  //   });
  //
  });

  // return net2;
};

export default getNetwork;
