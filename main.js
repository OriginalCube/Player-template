var audio = document.createElement('audio')
var index = 0
var volume = 0.5

loadSong()

async function loadSong(next = true) {
	try {
		const response = await fetch('songData.json')

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const data = await response.json()

		if (next && audio.paused) {
			if (index + 1 > data.length - 1) {
				index = 0
			} else {
				index++
			}
		} else {
			if (index - 1 < 0) {
				index = data.length - 1
			} else {
				index--
			}
		}

		// Set the simple data
		document.getElementById('image').src = data[index].image // Assuming data.image contains the base64-encoded image data
		document.getElementById('background').style.backgroundColor =
			data[index].background
		document.getElementById('name').textContent = data[index].name

		// Set the audio
		audio.src = data[index].music
		audio.controls = true
		audio.volume = volume

		const slider = document.getElementById('slider')
		slider.addEventListener('input', function () {
			// Update the current time of the audio element when slider is adjusted
			audio.currentTime = this.value
		})

		audio.addEventListener('loadedmetadata', function () {
			// Set the maximum value of the slider to the duration of the audio
			slider.max = audio.duration
		})

		// Update the slider value as the audio plays
		audio.addEventListener('timeupdate', function () {
			document.getElementById('slider').value = this.currentTime
		})

		await playAudio()
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error)
	}
}

audio.addEventListener('ended', async function () {
	await loadSong(true)
})

async function playAudio() {
	await audio.play()
	document.getElementById('play').style.display = 'none'
	document.getElementById('pause').style.display = 'block'
}

function pauseAudio() {
	audio.pause()
	document.getElementById('pause').style.display = 'none'
	document.getElementById('play').style.display = 'block'
}

function adjustVolume(increase = true) {
	if (increase) {
		if ((volume + 0.1).toFixed(1) < 1) {
			volume += 0.1
			audio.volume = volume
		}
	} else {
		if ((volume - 0.1).toFixed(1) > 0) {
			volume -= 0.1
			audio.volume = volume
		} else {
			audio.volume = 0
		}
	}
}

// Wallpaper engine settings

let audioCanvas = null
let audioCanvasCtx = null
function wallpaperAudioListener(audioArray) {
	// Clear the canvas and set it to black
	audioCanvasCtx.fillStyle = 'rgb(0,0,0)'
	audioCanvasCtx.fillRect(
		0,
		0,
		window.innerWidth * 0.35,
		window.innerHeight * 0.15,
	)

	// Render bars along the full width of the canvas
	var barWidth = Math.round((1.0 / 128.0) * audioCanvas.width)
	var halfCount = audioArray.length / 2

	// Begin with the left channel in red
	audioCanvasCtx.fillStyle = 'rgb(255,0,0)'
	// Iterate over the first 64 array elements (0 - 63) for the left channel audio data
	for (var i = 0; i < halfCount; ++i) {
		// Create an audio bar with its hight depending on the audio volume level of the current frequency
		var height = audioCanvas.height * Math.min(audioArray[i], 1)
		audioCanvasCtx.fillRect(
			barWidth * i,
			audioCanvas.height - height,
			barWidth,
			height,
		)
	}

	// Now draw the right channel in blue
	audioCanvasCtx.fillStyle = 'rgb(0,0,255)'
	// Iterate over the last 64 array elements (64 - 127) for the right channel audio data
	for (var i = halfCount; i < audioArray.length; ++i) {
		// Create an audio bar with its hight depending on the audio volume level
		// Using audioArray[191 - i] here to inverse the right channel for aesthetics
		var height = audioCanvas.height * Math.min(audioArray[191 - i], 1)
		audioCanvasCtx.fillRect(
			barWidth * i,
			audioCanvas.height - height,
			barWidth,
			height,
		)
	}
}

// Get the audio canvas once the page has loaded
audioCanvas = document.getElementById('AudioCanvas')
// Setting internal canvas resolution to user screen resolution
// (CSS canvas size differs from internal canvas size)
audioCanvas.height = window.innerHeight
audioCanvas.width = window.innerWidth
// Get the 2D context of the canvas to draw on it in wallpaperAudioListener
audioCanvasCtx = audioCanvas.getContext('2d')

// Register the audio listener provided by Wallpaper Engine.
window.wallpaperRegisterAudioListener(wallpaperAudioListener)
