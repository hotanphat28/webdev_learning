const videoElement = document.getElementById('background-video');
const toggleFilterButton = document.getElementById('toggle-filter');

let isBlackAndWhite = true;

// Video Filter Toggle
toggleFilterButton.addEventListener('click', () => {
    if (isBlackAndWhite) {
        videoElement.style.filter = 'none'; // Remove the grayscale filter
    } else {
        videoElement.style.filter = 'grayscale(100%)'; // Apply the grayscale filter
    }
    isBlackAndWhite = !isBlackAndWhite; // Toggle the state
});

// Change Video Background
function changeVideo(videoUrl) {
    videoElement.src = videoUrl;
    videoElement.load();
    videoElement.play();
}

// Playlist and Music Player Functionality
const songs = [
    { title: 'Nhạc không lời 1', file: 'assets/music/song1.mp3' },
    { title: 'Nhạc không lời 2', file: 'assets/music/song2.mp3' },
    { title: 'Nhạc không lời 3', file: 'assets/music/song3.mp3' },
];

let currentSongIndex = 0; // Default to the first song
let isPlaying = false;
const audio = new Audio(songs[currentSongIndex].file);
audio.volume = 0.5;

// DOM Elements
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const volumeSlider = document.getElementById('volume-slider');
const playlistContainer = document.getElementById('playlist-container');
const startButton = document.getElementById('start-button'); // Start Button
const interactionOverlay = document.getElementById('interaction-overlay'); // Overlay

// Initialize Playlist
function renderPlaylist() {
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.dataset.index = index;

        // Highlight the current song
        if (index === currentSongIndex) {
            li.classList.add('active');
        }

        li.addEventListener('click', () => selectSong(index));
        playlistContainer.appendChild(li);
    });
}

// Update Playlist Highlight
function updatePlaylistHighlight() {
    const allItems = playlistContainer.querySelectorAll('li');
    allItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Select a Song
function selectSong(index) {
    audio.pause();
    currentSongIndex = index;
    audio.src = songs[currentSongIndex].file;
    audio.play();
    isPlaying = true;
    updatePlaylistHighlight();
}

// Play Button
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play();
        isPlaying = true;
    }
});

// Pause Button
pauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    }
});

// Next Button
nextButton.addEventListener('click', () => {
    audio.pause();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    audio.src = songs[currentSongIndex].file;
    audio.play();
    isPlaying = true;
    updatePlaylistHighlight();
});

// Volume Slider
volumeSlider.addEventListener('input', (event) => {
    audio.volume = event.target.value;
});

// Enable Playback After User Interaction
startButton.addEventListener('click', () => {
    audio.play();
    isPlaying = true;
    updatePlaylistHighlight();

    // Remove Overlay
    interactionOverlay.style.display = 'none';
});

// Initialize App
renderPlaylist();
