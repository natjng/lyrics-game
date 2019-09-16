const BASE_URL = "http://localhost:3000"
const SONGS_URL = `${BASE_URL}/songs`
const USERS_URL = `${BASE_URL}/users`
const GAMES_URL = `${BASE_URL}/games`
const main = document.querySelector('main')
const welcome = document.querySelector('.welcome')
const loginBtn = document.querySelector('#login')
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

loginContainer.style.display = 'none';
gameControl.style.display = "none";

loginBtn.addEventListener('click', toggleLoginForm)

function toggleLoginForm() {
    loginForm = !loginForm
    if (loginForm) {
        loginContainer.style.display = 'block';
        loginBtn.style.display = 'none';
    } else {
        loginContainer.style.display = 'none';
    }
}

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
        })
}

function renderUser(user) {
    userDetails.innerHTML = ''
    let p = document.createElement('p')
    p.innerText = `Welcome, ${user.attributes.username}!`
    userDetails.append(p) 
    gameControl.style.display = "block";
    if (currentUser.attributes.highest_score) {
        let highScoreDiv = document.createElement('div');
        highScoreDiv.setAttribute('class', 'high-score');
        highScoreDiv.innerHTML = `<h3>Your High Score: ${currentUser.attributes.highest_score}</h3>`
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
    lyricsDiv.innerHTML = `<h2>"${song.attributes.lyrics}"</h2>`
    renderSongNames(song)
    songCounter += 1;
    currentSong = song;
}

function renderSongNames(song) {
    let songOptions = songs.filter(s => s !== song);
    let options = shuffleSongs(songOptions).slice(0, 3);
    options.push(song);
    let shuffledOptions = shuffleSongs(options);
    songNamesDiv.style.backgroundColor = "#ffffff00"
    songNamesDiv.innerHTML = ''
    shuffledOptions.forEach(option => {
        songNamesDiv.innerHTML += `
        <div class="hvr-grow" data-song-id=${option.id}>${option.attributes.name}</div><br>
        `
    })
}

songNamesDiv.addEventListener('click', handleOptions)

function handleOptions (event) {
    let selectedDiv = event.target
    if (parseInt(selectedDiv.dataset.songId, 10) === parseInt(currentSong.id, 10)) {
        selectedDiv.innerText = "🎉YAS"
        selectedDiv.style.backgroundColor = "#61c984"
        updateGameScore(currentGame)
        checkGameOver()
    } else {
        selectedDiv.innerText = "c'mon now 😔"
        selectedDiv.style.backgroundColor = "#f05151"
        checkGameOver()
    }
}

function checkGameOver() {
    if (songCounter === 10) {
        setTimeout( () => {
            lyricsDiv.innerHTML = `<h2>End Game.</h2><p>🎵I wanna be your endgame... 🎵</p>`;
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


// save game score in variable
// patch request game score after game ends
// refactor, put things in fns