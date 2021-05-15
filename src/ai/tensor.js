import * as tf from '@tensorflow/tfjs';
import { debug } from './getAiMove';

let model = null; //tf.sequential();

console.log('load tensor');;

const numberOfInput2ndlayer = 50;

async function testTensorflowTrain() {
  console.log('start tensorflow train');

  setModel();
  const trainXSet = [];
  // const trainYSet = [];
  const trainYSet = [];

  const x = [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  trainXSet.push(x);
  // const rawY = [0, 0, 0, 0, 0, 0, 0, 0, 1];
  const y = wrapLabelData(8, 1);
  trainYSet.push(y);
  await trainData(trainXSet, trainYSet);

  console.log('end train');

  const p = getPrediction(x);
  console.log('p:', p);
}

export function setModel() {
  // 18 ->9 -> 9
  model = tf.sequential();

  // 18, 9
  model.add(tf.layers.dense({units: numberOfInput2ndlayer, activation: 'relu', inputShape: [18]}));

  //->9
  model.add(tf.layers.dense({units: 9, activation: 'softmax'}));

  const optimizer = tf.train.adam(0.01); //irir default//params.learningRate);
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'], //<- optional
  });
}


export function wrapLabelData(index, value) {
  const target = Array(9).fill(0);
  target[index]=value;
  return target;
  // if (batchY) {
  //   batchY.push(target);
  // }
}

export async function trainData(batchX, batchY) {
  debug.log('trainData start');


  // Step1: train.

  // iris ref:
  // https://github.com/tensorflow/tfjs-examples/blob/master/iris/index.js
  // input: xTrain, yTrain, xTest, yTest
  // [Done] TODO convert them to Tensorflow format
  // const x = [[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]];//one set
  // const y = [[0, 0, 0, 0, 0, 0, 0, 0, 1]];
  const xTrain = tf.tensor2d(batchX, [batchX.length, 18]); // 1 set, 18 inputs (neurons)
  const yTrain = tf.tensor2d(batchY, [batchY.length, 9]);

  // const lossValues = [];
  // const accuracyValues = [];

  // Call `model.fit` to train the model.
  // const history = await = model.fit
  // const loss = history.history.loss[0];
  // const accuracy = history.history.acc[0];
  const history = await model.fit(xTrain, yTrain, {
    batchSize: batchX.length, // (number): Number of samples per gradient update. If unspecified, it will default to 32. Optional
    epochs: 1, //params.epochs, //iris, default 40, use epoch as batch
    // validationData: [xTest, yTest], 不提供會沒有logs.val_loss, logs.val_acc
    callbacks: {
      onEpochEnd: (epoch, logs) => {

        // console.log('onEpochEnd, logs:', logs); // logs.loss, logs.acc

        // console.log('test predict2');
        // model.predict(xTrain).print();
        // // Plot the loss and accuracy values at the end of every training epoch.
        // ui.plotLosses(lossValues, epoch, logs.loss, logs.val_loss);
        // ui.plotAccuracies(accuracyValues, epoch, logs.acc, logs.val_acc);
        //
        // // Await web page DOM to refresh for the most recently plotted values.
        // await tf.nextFrame();
      },
    }
  });

  debug.log('history:', history);

  // const loss = his.history.loss[0]; 2.38
  // const accuracy = history.history.acc[0]; 0
  // console.log('loss:', loss);

  // await tf.nextFrame(); iris跟mnist都有加 !!!!?

  debug.log('Model training complete.');
  // ui.status('Model training complete.');



  // await tf.nextFrame(); 要求強制重畫, 如果有排程plot的話

  // Tensor
  //    [[0.0956943, 0.1175393, 0.117693, 0.1122482, 0.1017766, 0.1322675, 0.1082607, 0.1118177, 0.1027028],]

  // tf.nextFrame () function source
  // Returns a promise that resolve when a requestAnimationFrame has completed.
  //
  // This is simply a sugar method so that users can do the following: await tf.nextFrame();
}

export function getPrediction(input){
  // console.log('getPrediction');
  const x = tf.tensor2d([input], [1, 18]); // 1 set, 18 inputs (neurons)
  const pre = model.predict(x);

  // pre.print(); // information

  // dataSync return TypedArray, e.g. [out1, out2],
  const data = pre.dataSync(); //這裡變成一維的, 可能是因為[output]會自動變成output吧

  // console.log('getPrediction end:', data);
  const data2 = Array.from(data);
  // console.log('getPrediction end2:', data2);
  return data2;
}

export function testTensor() {

  console.log('testTensor start');
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    model.predict(tf.tensor2d([5], [1, 1])).print();
  });

  console.log('testTensor end');

}
