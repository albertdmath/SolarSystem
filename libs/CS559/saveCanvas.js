// Code to take screenshot and screen-record HTML Canvas element.
// For THREE.js Canvas elements, preserveDrawingBuffer needs to be set to true, or use the renderer to take a screenshot.

export function screenshot(id = "canvas") {
    let canvas = document.getElementById(id);
    if (canvas) {
        let image = canvas.toDataURL();
        let link = document.createElement("a");
        link.download = id + ".png";
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function record (id = "canvas", idt = "time") {
    let canvas = document.getElementById(id);
    let time = Math.min(Number(document.getElementById(idt).value), 60);
    if (canvas && time > 0) {
        let chunks = [];
        let stream = canvas.captureStream(time);
        let recorder = new MediaRecorder(stream);
        recorder.ondataavailable = function (event) {
            chunks.push(event.data);
        }
        recorder.onstop = function (event) {
            let blob = new Blob(chunks, { "type": "video/mp4" });
            chunks = [];
            let url = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.download = id + ".mp4";
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        recorder.start();
        setTimeout(function () { recorder.stop() }, time * 1000);
        for (let t = time - 1; t >= 0; t --) {
            setTimeout(function () { document.getElementById(idt).value = t }, (time - t) * 1000);
        }
    }
}