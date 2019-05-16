// TypeScript Photo Booth Demo Project
// @author Kenneth Reilly <kenneth@innovationgroup.tech>

abstract class PhotoBooth {
	
	static constraints = { audio: false, video: true }; 

	static get_media(): Promise<MediaStream> {

		return navigator.mediaDevices.getUserMedia(PhotoBooth.constraints)
	}

	static init() {

		PhotoBooth.get_media()
			.then(PhotoBooth.on_get_media)
			.catch(PhotoBooth.on_error)
	}

	static on_get_media = (stream: MediaStream) => {

		let video = document.querySelector('video')
		let track = stream.getVideoTracks[0]
		
		video.srcObject = stream
		video.onloadedmetadata = () => { video.play() }
		track.applyConstraints({ advanced: [{torch: true}]  });
	}

	static on_error = (reason: any) => { console.log(reason) }
}

PhotoBooth.init()