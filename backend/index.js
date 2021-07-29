import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path/posix';
import fs from 'fs'
import { bufferToImage } from 'face-api.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


app.post('/login',async (req,res)=>{
    
    var matches = req.body.data.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer(matches[2], 'base64');
    var savePath = path.resolve('image_test.png');
    fs.writeFileSync(savePath, buffer);

    const __dirname = path.resolve(path.dirname(''));
    const processsp = await spawn('python3',[__dirname +'/Reco.py'] )
    processsp.stdout.on('data', (data) => {
        try {
            res.status(201).json(data.toString());
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    });
})

app.listen(5000)

