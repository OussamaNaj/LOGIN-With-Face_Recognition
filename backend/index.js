import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path/posix';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


app.post('/login',async (req,res)=>{
    try {
        var image=req.body.data
        const __dirname = path.resolve(path.dirname(''));
        const processsp = await spawn('python3',[__dirname +'/Reco.py',image] )
        processsp.stdout.on('data', (data) => {
            try {
                res.status(201).json(data.toString());
            } catch (error) {
                res.status(409).json({ message: error.message });
            }
        });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
})

app.listen(5000)

