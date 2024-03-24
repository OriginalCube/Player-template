fetch('songData.json')
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		document.getElementById('image').src = data[0].image; // Assuming data.image contains the base64-encoded image data
		document.getElementById('background').style.backgroundColor = data[0].background;
	})
	.catch(error => {
		console.error('There was a problem with your fetch operation:', error);
	});
