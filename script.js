let player;
let loopTime = 0; // Loop time in seconds
let videoId = '';
let playerIframe = null; // Reference to iframe element
let currentVolume = 50; // Initial volume (50%)

// Function to start the video and embed the YouTube iframe
function startVideo() {
    const link = document.getElementById('videoLink').value;
    const loopHours = parseInt(document.getElementById('loopHours').value, 10) || 0;

    loopTime = loopHours * 3600;

    const videoIdMatch = link.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|(?:.*[?&]v=))([^"'\n\s&]+))/);

    if (videoIdMatch) {
        videoId = videoIdMatch[1];  // Extracted video ID
        console.log(`Extracted video ID: ${videoId}`);

        if (playerIframe) {
            playerIframe.remove();
        }

        playerIframe = document.createElement('iframe');
        playerIframe.width = '560';
        playerIframe.height = '315';
        playerIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1`;
        playerIframe.frameBorder = '0';
        playerIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        playerIframe.allowFullscreen = true;

        document.getElementById('playerContainer').appendChild(playerIframe);

        playerIframe.addEventListener('load', function() {
            checkLoop();
        });

        const volumeSlider = document.getElementById('volumeControl');
        volumeSlider.value = currentVolume;
        volumeSlider.addEventListener('input', function() {
            currentVolume = volumeSlider.value;
            setVolume(currentVolume);
        });
    } else {
        alert('Invalid YouTube Link');
    }
}

// Function to continuously check if the video should be looped
function checkLoop() {
    const intervalId = setInterval(() => {
        const player = new YT.Player(playerIframe);

        if (player.getPlayerState() === 0) { // 0 = VIDEO_ENDED
            console.log('Video ended. Restarting if loop is set.');

            if (loopTime > 0) {
                player.seekTo(0); // Start the video from the beginning
                player.playVideo(); // Play again
                loopTime--;
                console.log(`Loop time left: ${loopTime} seconds`);
            } else {
                console.log("Loop time finished. Stopping video.");
                clearInterval(intervalId); // Stop checking after loop is done
            }
        }
    }, 1000);
}

// Function to set the volume of the video
function setVolume(volume) {
    const player = new YT.Player(playerIframe);
    player.setVolume(volume); // Set volume from slider value
}
