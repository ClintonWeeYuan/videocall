export async function getMedia() {
    let stream = null;
    //   navigator.mediaDevices.webkitGetUserMedia ||
    //   navigator.mediaDevices.mozGetUserMedia;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        return stream;
    } catch (err) {
        console.log(err);
    }
}