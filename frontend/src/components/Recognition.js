import React,{useEffect,useRef,useState} from 'react';
import * as faceapi  from 'face-api.js' ;
import axios from 'axios';
const url = 'http://localhost:5000/login';

const Recogn = () => {

  const [init,setinit]=useState(false);
  const videoRef = useRef();
  const canvaRef= useRef();

  useEffect(()=>{
    const loadModels = async ()=>{
      const MODEL_URL=  process.env.PUBLIC_URL + '/models'
      setinit(true);
      Promise.all([
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]).then(startVideo)
    };
    loadModels();
  },[])

  
  
  const startVideo=()=> {
    navigator.getUserMedia(
      { video: {} },
      stream => videoRef.current.srcObject = stream,
      err => console.error(err)
    )
  }

  const handleVideoOnPlay =()=>{
    setInterval(async ()=>{
      if(init){
        setinit(false);
      }
      canvaRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
      const displaySize ={
        width : "720",
        height :"560"
      }
      faceapi.matchDimensions(canvaRef.current,displaySize)
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      
      if(detections.length!==0){
      var ctx =canvaRef.current.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, displaySize.width, displaySize.height);
      var dataURI = canvaRef.current.toDataURL('image/png').replace("image/png", "image/octet-stream");;
      axios.post(url, {data:dataURI} )
      .then((response)=> {
        console.log(response.data);
      });
    }
  },1000)
}

  return(
  <div>
    <span>{init ? "initializing":"Ready"}</span>
    <video ref={videoRef} width="720" height="560" autoPlay muted onPlay={handleVideoOnPlay}/>
    <canvas ref={canvaRef} hidden/>

  </div>
)}
export default Recogn;