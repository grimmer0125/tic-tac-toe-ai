import * as tf from '@tensorflow/tfjs';

export function testTensor2() {
  console.log('testTensor2 start');

  // TODO: Step1: train.

  // 18 ->9 -> 9
  const model = tf.sequential();

  // 18, 9
  model.add(tf.layers.dense({units: 9, activation: 'relu', inputShape: [18]}));

  //->9
  model.add(tf.layers.dense({units: 9, activation: 'softmax'}));

  const optimizer = tf.train.adam(0.01); //irir default//params.learningRate);
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'], //<- optional
  });

  // iris ref:
  // https://github.com/tensorflow/tfjs-examples/blob/master/iris/index.js
  // input: xTrain, yTrain, xTest, yTest
  //TODO convert them to Tensorflow format
  const x = [[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]];//one set
  const y = [[0, 0, 0, 0, 0, 0, 0, 0, 1]];
  const xTrain = tf.tensor2d(x, [1, 18]); // 1 set, 18 inputs (neurons)
  const yTrain = tf.tensor2d(y, [1, 9]);

  const lossValues = [];
  const accuracyValues = [];

  // Call `model.fit` to train the model.
  // const history = await = model.fit
  // const loss = history.history.loss[0];
  // const accuracy = history.history.acc[0];
  model.fit(xTrain, yTrain, {
    //batchSize: BATCH_SIZE ?? <- use the size of xTrain, fixed嗎?
    epochs: 1, //params.epochs, //iris, default 40, use epoch as batch
    // validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: (epoch, logs) => {

        console.log('onEpochEnd');
        // // Plot the loss and accuracy values at the end of every training epoch.
        // ui.plotLosses(lossValues, epoch, logs.loss, logs.val_loss);
        // ui.plotAccuracies(accuracyValues, epoch, logs.acc, logs.val_acc);
        //
        // // Await web page DOM to refresh for the most recently plotted values.
        // await tf.nextFrame();
      },
    }
  });

  // console.log('Model training complete.');
  // ui.status('Model training complete.');

  // TODO:  2. Try to test prediction
  console.log('test predict');
  model.predict(xTrain).print();
  // Tensor
  //    [[0.0956943, 0.1175393, 0.117693, 0.1122482, 0.1017766, 0.1322675, 0.1082607, 0.1118177, 0.1027028],]

}


export function testTensor() {

  console.log('testTensor1');
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

  console.log('testTensor2');

}
