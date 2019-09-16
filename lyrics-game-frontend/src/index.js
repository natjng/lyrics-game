const BASE_URL = "http://localhost:3000"
const SONGS_URL = `${BASE_URL}/songs`
const USERS_URL = `${BASE_URL}/users`
const GAMES_URL = `${BASE_URL}/games`
const main = document.querySelector('main')
const welcome = document.querySelector('.welcome')
const loginContainer = document.querySelector('.login-container')
const submitBtn = document.querySelector('.submit')
const userDetails = document.querySelector('.user-details')
const gameControl = document.querySelector('.game-control')
const startBtn = document.querySelector('#startBtn')
const gameContainer = document.querySelector('.game-container')
const lyricsDiv = document.querySelector('.lyrics')
const songNamesDiv = document.querySelector('.song-names')
const scoreDiv = document.querySelector('.score')
let loginForm = false;
let currentUser;
let currentGame;
let songs;
let gameSongs;
let songCounter;
let currentSong;
let score;
// let userGames;
// if I wanted all user's games

lyricsDiv.style.display = 'none';
gameControl.style.display = "none";

loginContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    postUser(event.target.username.value);
})

function postUser(username) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({username})
    }
    fetch(USERS_URL, configObj)
        .then(res => res.json())
        .then(json => {
            currentUser = json.data;
            renderUser(currentUser);
            loginContainer.style.display = 'none';
            welcome.style.display = 'none';
            // userGames = json.included;
            // if I wanted all user's games
        })
}

function renderUser(user) {
    userDetails.innerHTML = ''
    let h3 = document.createElement('h3')
    h3.innerText = `💿 ${user.attributes.username}`
    userDetails.append(h3) 
    gameControl.style.display = "block";
    if (currentUser.attributes.highest_score) {
        let highScoreDiv = document.createElement('div');
        highScoreDiv.setAttribute('class', 'high-score');
        highScoreDiv.innerHTML = `<p>Your High Score</p><h2>🏆 ${currentUser.attributes.highest_score}</h2>`
        userDetails.append(highScoreDiv);
    }
}

startBtn.addEventListener('click', (event) => {
    gameControl.style.display = "none";
    gameContainer.style.display = "block";
    startGame(currentUser);
})

function getSongs() {
    fetch(SONGS_URL)
        .then(res => res.json())
        .then(json => { songs = json.data })
}

function postGame(user) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({score: 0, user_id: user.id})
    }
    fetch(GAMES_URL, configObj)
        .then(res => res.json())
        .then(game => {
            currentGame = game.data;
            console.log("currentGame", currentGame)
            // score = currentGame.attributes.score;
            // console.log('score:', score);
            renderGameScore(currentGame);
        })
}

function renderGameScore(currentGame) {
    scoreDiv.innerHTML = `<h2>Score: ${currentGame.attributes.score}/10</h2>`
}

function startGame(user) {
    songCounter = 0;
    postGame(user);
    gameSongs = shuffleSongs(songs).slice(0, 10);
    renderLyrics(gameSongs[songCounter])
}

function renderLyrics(song) {
    lyricsDiv.style.display = 'inline-block';
    lyricsDiv.innerHTML = `<h1>${song.attributes.lyrics}</h1>`
    renderSongNames(song)
    songCounter += 1;
    currentSong = song;
}

function renderSongNames(song) {
    let songOptions = songs.filter(s => s !== song);
    let options = shuffleSongs(songOptions).slice(0, 3);
    options.push(song);
    let shuffledOptions = shuffleSongs(options);
    songNamesDiv.style.backgroundColor = ''
    songNamesDiv.innerHTML = ''
    shuffledOptions.forEach(option => {
        songNamesDiv.innerHTML += `
        <div class="option hvr-grow" data-song-id=${option.id}>${option.attributes.name}</div><br>
        `
    })
}

songNamesDiv.addEventListener('click', handleOptions)

function handleOptions (event) {
    let selectedDiv = event.target
    if (parseInt(selectedDiv.dataset.songId, 10) === parseInt(currentSong.id, 10)) {
        selectedDiv.innerText = "🎉YAS"
        selectedDiv.style.backgroundColor = "#479679"
        updateGameScore(currentGame)
        checkGameOver()
    } else {
        selectedDiv.innerText = "c'mon now 😔"
        selectedDiv.style.backgroundColor = "#e04a4a"
        checkGameOver()
    }
}

function checkGameOver() {
    if (songCounter === 10) {
        setTimeout( () => {
            lyricsDiv.innerHTML = `<h1>End Game.</h1><h3>🎵I wanna be your endgame... 🎵</h3>`;
            songNamesDiv.innerHTML = ''
            gameControl.style.display = "block";
            postUser(currentUser.attributes.username)
        }, 500)
    } else {
        setTimeout( () => renderLyrics(gameSongs[songCounter]), 500)
    }
}

function updateGameScore(currentGame) {
    let newScore = currentGame.attributes.score += 1
    
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({score: newScore})
    }
    fetch(`${GAMES_URL}/${currentGame.id}`, configObj)
        .then(res => res.json())
        .then(updatedGame => {
            // console.log(`Score after patch request: ${updatedGame.attributes.score}`);
            currentGame = updatedGame.data
            renderGameScore(currentGame);
        })
}

function shuffleSongs(songs) {
    let m = songs.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = songs[m];
        songs[m] = songs[i];
        songs[i] = t;
    }
    return songs;
}

getSongs();