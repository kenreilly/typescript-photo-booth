// TypeScript Photo Booth Demo Project
// @author Kenneth Reilly <kenneth@innovationgroup.tech>
class PhotoBooth {
    static get_media() {
        return navigator.mediaDevices.getUserMedia(PhotoBooth.constraints);
    }
    static init() {
        PhotoBooth.get_media()
            .then(PhotoBooth.on_get_media)
            .catch(PhotoBooth.on_error);
    }
}
PhotoBooth.constraints = { audio: false, video: true };
PhotoBooth.on_get_media = (stream) => {
    let video = document.querySelector('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => { video.play(); };
};
PhotoBooth.on_error = (reason) => { console.log(reason); };
PhotoBooth.init();
