// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

let classifier;
let video;

let bgCol = 0;

let button;
let t;
let output = "";

function setup() {
  
  createCanvas(640,600);
  
  if (isMobileDevice()) {
  	console.log("mobile device");
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  };
  
  video = createCapture(constraints);
  } else {
  	console.log("NOT mobile device");
    video = createCapture(VIDEO);
  }
  video.hide();
  
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);  
  button = createButton('Take a snapshot');
  button.position(0, 300);
  button.mousePressed(snapshot);
}

function draw() {
 image(video, 0, 0, 240, 180);
 fill(bgCol);
 // rect(75,190,50,50);
  
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}


function modelReady() {
  // Change the status of the model once its ready
  select('#status').html('Model Loaded');
  // Call the classifyVideo function to start classifying the video
  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.predict(gotResult);
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by probability.
  select('#result').html(results[0].className);
  select('#probability').html(nf(results[0].probability, 0, 2));
  classifyVideo();
}

function snapshot() {
  // bgCol = random(255);
  // t = null;
  img = image(video, 0, 300, 320, 230);
  
  classifier.predict(img, function(err, results) {
    if (err) {
      console.error(err);
    }
    else {
      console.log(results);
      // output = results[0].className + "\nprobability " + nf(results[0].probability, 0, 2);
      output = results.map(e => {
        return e.className + " (" + nf(e.probability, 0, 2) + ")"
      }).join("\n");
      console.log(output)
      
      fill('rgb(255,255,255)');
      rect(0, 230, 320, 60);
      fill(0)
      textAlign(CENTER);
      text(output, 160, 250);
    }
  });
}

