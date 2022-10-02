import * as path from 'path';
import express, { request, response } from 'express';
import * as fs from 'fs';
import cors from 'cors';
import { spawnSync } from 'child_process';
import { parse } from 'csv-parse';


const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

const app = express();

app.use(cors(options));

const PORT = 5001;

app.get('/debug', (request, response) => {
    response.send('hello')
})


app.get('/updateCluster', (request, response) => {
    if (request.query.distance === undefined){
        console.error('distance not defined');
    }
    var distance = parseFloat(request.query.distance as string);
    console.log(distance);

    const process = spawnSync('python',[ './src/cluster.py', distance.toString()])
    console.log(process.status);

    const resultsPath = path.resolve(__dirname, '../../data/cluster_3.csv');
    // const similarPoint = require('../../data/most_similar_5_id_3.json');
    // const similarPoint = require(path.resolve(__dirname, '../../data/most_similar_5_id_3.json'));
    const similarPoint = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/most_similar_5_id_3.json'), 'utf8'));
    // const similarAnswer = require('../../data/most_similar_5_answer_3.json');
    // const similarAnswer = require(path.resolve(__dirname, '../../data/most_similar_5_answer_3.json');
    const similarAnswer = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/most_similar_5_answer_3.json'), 'utf8'));
    console.log(similarAnswer);
    const similarContent = [];
    var clusters = Object.keys(similarPoint);
    for (var cluster of clusters) {
    similarContent.push({cluster:cluster,id:similarPoint[cluster],answer:similarAnswer[cluster]})
    }; 
    let similar = similarContent;
    // console.log(resultsPath);
    const headers = ["", "id", 'text', 'agg_bert_row', "answer_length","x_position","y_position"];
    // ,id,text,agg_bert_row,
    var content
    const fileContent = fs.readFileSync(resultsPath );
    parse(fileContent, {
        delimiter: ',',
        columns: headers,
      }, (error, result) => {
        if (error) {
          // console.error(error);
        }
        result.shift();
        result.forEach((value: any) => {
            value.id = parseInt(value.id);
            value.agg_bert_row = parseInt(value.agg_bert_row);
        })
        content = result;
        // console.log(similar);
        response.send({clusteredAnswers: content,clusters:clusters, similarContent: similar })
    })

})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});