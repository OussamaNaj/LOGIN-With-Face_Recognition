import { spawn } from 'child_process';
import path from 'path/posix';
import fs from 'fs'

async function Recogn(img){
    // image download
    var matches = img.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer(matches[2], 'base64');
    var savePath = path.resolve('image_test.png');
    fs.writeFileSync(savePath, buffer);

    const __dirname = path.resolve(path.dirname(''));
    const processsp = await spawn('python3',[__dirname +'/Reco.py'] )
    processsp.stdout.on('data', (data) => {
        // console.log(data.toString())
        return data.toString();
    });
}

export default Recogn;

