const Brain = require("brain.js");
const apiKey = "7d4a73a2b7a6fd2e5d57acd8c019cb82178961644e25b7caad3239d04e79da4b";
const axios = require('axios');
const brain = require("brain.js");
let trainingData = [];
let openMin = Infinity;
let closeMin = Infinity;
let lowMin = Infinity;
let highMin = Infinity;

function timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function scaleDown(step) {
    return {
        open: (step.open/openMin),
        high: (step.high/highMin),
        low: (step.low/lowMin),
        close: (step.close/closeMin)
    };
}

function scaleUp(step) {
    return {
        open: step.open * openMin,
        high: step.high * highMin,
        low: step.low * lowMin,
        close: step.close * closeMin
    };
}

axios.get('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=19&api_key=7d4a73a2b7a6fd2e5d57acd8c019cb82178961644e25b7caad3239d04e79da4b')
    .then(function (response) {
        for(let i=0; i<response.data.Data.Data.length;i++)
        {
            if (response.data.Data.Data[i].open < openMin)
            {
                openMin = response.data.Data.Data[i].open;
            }
            if (response.data.Data.Data[i].close < closeMin)
            {
                closeMin = response.data.Data.Data[i].close;
            }
            if (response.data.Data.Data[i].low < lowMin)
            {
                lowMin = response.data.Data.Data[i].low;
            }
            if (response.data.Data.Data[i].high < highMin)
            {
                highMin = response.data.Data.Data[i].high;
            }
            let rawdata = {
                //time: timeConverter(response.data.Data.Data[i].time),
                open: response.data.Data.Data[i].open,
                high: response.data.Data.Data[i].high,
                low: response.data.Data.Data[i].low,
                close: response.data.Data.Data[i].close
            }
            trainingData.push(rawdata)

        }
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        const scaledData = trainingData.map(scaleDown);

        const trainingDatas = [
    scaledData.slice(0, 5),
    scaledData.slice(5, 10),
    scaledData.slice(10, 15),
    scaledData.slice(15, 20),
];

//console.log(trainingData);

const net = new brain.recurrent.LSTMTimeStep({
    //we have open close high and low so its 4 for input and output
    //Hidden layers are the layers that lie between the input and output layer of a neural network.
    inputSize: 4,
    HiddenLayers: [8,8],
    outputSize: 4
});


net.train(trainingDatas, {
    learningRate: 0.005,
    errorThresh: 0.0000000000002,
    log: (stats) => console.log(stats)
});

        console.log("Bitcoin Price Forecast")
        console.log(net.forecast([
            trainingDatas[0][0],
            trainingDatas[0][1],
        ], 1).map(scaleUp));


console.log("Current Bitcoin Price")
console.log(trainingData[19])
    });



