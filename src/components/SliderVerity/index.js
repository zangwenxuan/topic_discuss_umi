/*
import React, {Component} from "react";
import {Slider} from "antd";

let loadTimer;
let imgObject = new Image();
imgObject.src = 'http://localhost:8080/pic/cover.jpg';
imgObject.onLoad = onImgLoaded();

function onPreloadComplete(){
  //call the methods that will create a 64-bit version of thumbnail here.
  return getImagePortion(imgObject, 120, 150, 150, 80, 2);
  //place image in appropriate div
}
function getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio){
  /!* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio *!/
  //set up canvas for thumbnail
  let tnCanvas = document.createElement('canvas');
  let tnCanvasContext = tnCanvas.getContext('2d');
  tnCanvas.width = newWidth; tnCanvas.height = newHeight;

  /!* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this *!/
  let bufferCanvas = document.createElement('canvas');
  let bufferContext = bufferCanvas.getContext('2d');
  bufferCanvas.width = imgObj.width;
  bufferCanvas.height = imgObj.height;
  bufferContext.drawImage(imgObj, 0, 0);

  /!* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas *!/
  tnCanvasContext.drawImage(
    bufferCanvas,
    startX,
    startY,
    newWidth * ratio,
    newHeight * ratio,
    0,
    0,
    newWidth,
    newHeight
  );
  return tnCanvas.toDataURL();
}
function onImgLoaded() {
  if (loadTimer != null) clearTimeout(loadTimer);
  if (!imgObject.complete) {
    loadTimer = setTimeout(function() {
      onImgLoaded();
    }, 3);
  } else {
    onPreloadComplete();
  }
}

export default class SliderVerity extends Component {
  state={
    image:null
  }
  render() {
    return (
      <div>
        <div style={{ width: "300px", height: "200px" }}>
          <img
            style={{ width: "100%" }}
            src={imgObject}
          />
          <Slider />
        </div>
      </div>
    );
  }
}
*/
