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
let songCounter = 0;
let currentSong;
let score;

// loginContainer.style.display = 'none';
gameControl.style.display = "none";

loginBtn.addEventListener('click', () => {
    loginForm = !loginForm
    if (loginForm) {
        loginContainer.style.display = 'block';
        welcome.style.display = 'none';
    } else {
        loginContainer.style.display = 'none';
    }
})

loginContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    postUser(event);
})

function postUser(event) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({username: event.target.username.value})
    }
    fetch(USERS_URL, configObj)
        .then(res => res.json())
        .then(json => {
            currentUser = json;
            renderUser(currentUser);
            loginContainer.style.display = 'none';
            welcome.style.display = 'none';
        })
}

function renderUser(user) {
    let p = document.createElement('p')
    p.innerText = `Welcome, ${user.username}!`
    userDetails.append(p) 
    gameControl.style.display = "block";
}

startBtn.addEventListener('click', (event) => {
    gameControl.style.display = "none";
    gameContainer.style.display = "block";
    startGame(currentUser);
})

function getSongs() {
    fetch(SONGS_URL)
        .then(res => res.json())
        .then(json => { songs = json })
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
            console.log("Game", game)
            currentGame = game;
            score = game.score;
            renderGameScore(currentGame);
        })
}

function renderGameScore(currentGame) {
    scoreDiv.innerHTML = `<h2>Score: ${currentGame.score}/10</h2>`
}

function startGame(user) {
    postGame(user);
    renderLyrics(songs[songCounter])
}

function renderLyrics(song) {
    lyricsDiv.innerHTML = `<h2>🎵${song.lyrics} 🎶</h2>`
    renderSongNames(song)
    console.log(songCounter, "before increase")
    songCounter += 1;
    console.log("curent song count", songCounter)
    currentSong = song;
}

function renderSongNames(song) {
    // n = Math.floor(Math.random()*songs.length)
    // console.log(`n = ${n} inside renderSongNames()`)

    // need to exclude song name with lyrics already shown
    // put lyrics's song in array
    // get 3 songs
    // exclude if song.id already in array
    // add to array
    
    let randomSongs = [songs[Math.floor(Math.random()*songs.length)], songs[Math.floor(Math.random()*songs.length)], songs[Math.floor(Math.random()*songs.length)]]
    //console.log(randomSongs)

    songNamesDiv.innerHTML = `
        <div id="option-a" class ="option-choice" data-song-id=${randomSongs[0].id}>${randomSongs[0].name}</div><br>
        <div id="option-b" class ="option-choice" data-song-id=${randomSongs[1].id}>${randomSongs[1].name}</div><br>
        <div id="option-c" class ="option-choice" data-song-id=${randomSongs[2].id}>${randomSongs[2].name}</div><br>
        <div id="option-d" class ="option-choice" data-song-id=${song.id}>${song.name}</div><br>
        `
    //console.log(`answer: ${song.name}`);
}

songNamesDiv.addEventListener('click', (event) => {
    // console.log(event)
    if (parseInt(event.target.dataset.songId, 10) === currentSong.id) {
        //console.log('correct');
        updateGameScore(currentGame)
        if (songCounter === 10) {
            lyricsDiv.innerHTML = `<h2>End Game.</h2><p>🎵I wanna be your endgame... 🎵</p>`;
            songNamesDiv.innerHTML = ''
            gameControl.style.display = "block";
        } else {
            renderLyrics(songs[songCounter])
        }
        // renderLyrics(songs[songCounter])
        // make div green, display Correct!
    } else {
        //console.log('wrong');
        // console.log(event.target.style);
        // event.target.style.borderColor = "#8B0000"
        if (songCounter === 10) {
            lyricsDiv.innerHTML = `<h2>End Game.</h2><p>🎵I wanna be your endgame... 🎵</p>`;
            songNamesDiv.innerHTML = ''
            gameControl.style.display = "block";
        } else {
            renderLyrics(songs[songCounter])
        }
        // renderLyrics(songs[songCounter])
        // make div red, display Nope.
    }
})

function updateGameScore(currentGame) {
    // console.log(`Score before patch request: ${currentGame.score}`);

    let newScore = currentGame.score += 1
    
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
            console.log(`Score after patch request: ${updatedGame.score}`);
            renderGameScore(updatedGame);
        })
}

getSongs();

// songs = array of 10 songs
// songs.indexOf(currentSong)
// render random song
// n = Math.floor(Math.random()*songs.length)
// console.log(`n = ${n} song lyrics`)
// renderLyrics(songs[n])

// 10 rounds
// need to randomize lyrics and names
// cant repeat lyrics or names
// save game score in variable
// patch request game score after game ends
// add serializers

// getSongs() when js loads
// startGame > 10 random lyrics > renderLyrics

// let interval = setInterval(renderLyrics, 5000);
// if (songCounter ===  10) {
//      alert("GAME OVER");
//      document.location.reload();
//      clearInterval(interval);
// }