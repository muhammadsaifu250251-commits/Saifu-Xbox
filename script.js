const URL = "./my_model/";

let model;
let webcam;
let labelContainer;
let maxPredictions;

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    maxPredictions = model.getTotalClasses();

    const flip = true;

    webcam = new tmImage.Webcam(300, 300, flip);

    await webcam.setup();
    await webcam.play();

    window.requestAnimationFrame(loop);

    const container = document.getElementById("webcam-container");

    container.innerHTML = "";
    container.appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");

    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {

        labelContainer.appendChild(
            document.createElement("div")
        );

    }

    document.getElementById("startButton").style.display = "none";
}

async function loop() {

    webcam.update();

    await predict();

    window.requestAnimationFrame(loop);
}

async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let highestIndex = 0;

    for (let i = 1; i < prediction.length; i++) {

        if (
            prediction[i].probability >
            prediction[highestIndex].probability
        ) {

            highestIndex = i;

        }
    }

    for (let i = 0; i < maxPredictions; i++) {

        const name = prediction[i].className;

        const percent =
            (prediction[i].probability * 100).toFixed(1);

        labelContainer.childNodes[i].innerHTML =
            `${name} : ${percent}%`;

    }

    const result =
        prediction[highestIndex].className;

    document.getElementById("result").dataset.shape = result;
}