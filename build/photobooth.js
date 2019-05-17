// TypeScript Photo Booth Demo Project
// @author Kenneth Reilly <kenneth@innovationgroup.tech>
import { CameraMode, Defaults } from './types.js';
class PhotoBooth {
    static init() {
        PhotoBooth.buttons.take_photo = document.querySelector("button[name='take_photo']");
        PhotoBooth.buttons.switch_cam = document.querySelector("button[name='switch_cam']");
        PhotoBooth.buttons.take_photo.onclick = () => { PhotoBooth.take_photo(); };
        PhotoBooth.buttons.switch_cam.onclick = () => { PhotoBooth.switch_cam(); };
        navigator.mediaDevices.enumerateDevices()
            .then(PhotoBooth.on_enumerate_devices)
            .catch(PhotoBooth.on_error);
    }
    static on_enumerate_devices(devices) {
        if (devices.length < 1) {
            PhotoBooth.buttons.take_photo.disabled = true;
        }
        if (devices.length < 2) {
            PhotoBooth.buttons.switch_cam.disabled = true;
        }
        return PhotoBooth.init_camera();
    }
    static init_camera() {
        return PhotoBooth.get_media()
            .then(PhotoBooth.on_get_media)
            .catch(PhotoBooth.on_error);
    }
    static get_media() {
        let constraints = { audio: false, video: { facingMode: PhotoBooth.mode } };
        return navigator.mediaDevices.getUserMedia(constraints);
    }
    static take_photo() {
        let context = PhotoBooth.canvas.getContext('2d');
        context.drawImage(PhotoBooth.video, 0, 0, PhotoBooth.canvas.width, PhotoBooth.canvas.height);
        let url = PhotoBooth.canvas.toDataURL('image/jpeg');
        let a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = 'photo.jpeg';
        a.click();
    }
    static switch_cam() {
        PhotoBooth.mode = (PhotoBooth.mode == CameraMode.User) ? CameraMode.Environment : CameraMode.User;
        PhotoBooth.init_camera();
    }
}
PhotoBooth.mode = CameraMode.Environment;
PhotoBooth.buttons = { take_photo: null, switch_cam: null };
PhotoBooth.on_get_media = (stream) => {
    PhotoBooth.canvas = document.createElement('canvas');
    PhotoBooth.video = document.querySelector('video');
    PhotoBooth.video.onloadedmetadata = () => { PhotoBooth.video.play(); };
    PhotoBooth.video.oncanplay = () => { PhotoBooth.on_video_ready(); };
    PhotoBooth.video.srcObject = stream;
};
PhotoBooth.on_video_ready = () => {
    PhotoBooth.canvas.width = Defaults.width;
    PhotoBooth.canvas.height = PhotoBooth.video.videoHeight / (PhotoBooth.video.videoWidth / Defaults.width);
    PhotoBooth.video.setAttribute('height', PhotoBooth.canvas.height.toString());
    PhotoBooth.video.setAttribute('width', PhotoBooth.canvas.width.toString());
};
PhotoBooth.on_error = (reason) => { console.log(reason); };
PhotoBooth.init();
