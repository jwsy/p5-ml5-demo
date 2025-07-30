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
  video.size(320, 240); // ensure the captured video has a known resolution
  video.hide();
  
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);  
  button = createButton('Take a snapshot');
  button.position(20, 350);
  button.mousePressed(snapshot);
}

function draw() {
 image(video, 20, 0, video.width, video.height);
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
  // console.log(results[0].className);
  const desiredClasses = [
    'mortarboard', 'banjo', 'hotdog', 'hot dog'
  ];
  select('#result').style('background-color', '').style('font-size', '1em');
  for (c in desiredClasses) {
    if (results[0].className.includes(desiredClasses[c])) {
        select('#result').style('background-color', 'red').style('font-size', '3em');
    }
  } 

  select('#probability').html(nf(results[0].probability, 0, 2));
  classifyVideo();
}

function snapshot() {
  // draw the current frame at its actual size
  image(video, 20, 300, video.width, video.height);
  const img = video.get();
  
  classifier.predict(img, function(err, results) {
    if (err) {
      console.error(err);
    }
    else {
      console.log(results);
      output = results.map(e => {
        return e.className + " (" + nf(e.probability, 0, 2) + ")"
      }).join("\n");
      console.log(output)
      
      noStroke();
      fill('rgb(255,255,255)');
      rect(00, 240, 360, 60);
      fill(0)
      textAlign(CENTER);
      text(output, 180, 250);
    }
  });
}

