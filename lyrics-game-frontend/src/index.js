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
const lyricsDiv = document.querySelector('.lyrics')
const songNamesDiv = document.querySelector('.song-names')
const scoreDiv = document.querySelector('.score')
let loginForm = false;
let currentGame;
let songs;
let score;

loginContainer.style.display = 'none';

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
    console.log(event.target)
    console.log(event.target.username.value)
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
            console.log(json)
            renderUser(json);
            loginContainer.style.display = 'none';
            welcome.style.display = 'none';
        })
}

function renderUser(user) {
    let p = document.createElement('p')
    p.innerText = `Welcome, ${user.username}!`
    userDetails.append(p) 

    if (user) {
        let startBtn = document.createElement('button')
        startBtn.id = 'startBtn'
        startBtn.innerHTML = "Start Game!"
        userDetails.append(startBtn)

        startBtn.addEventListener('click', (event) => {
            // event.preventDefault();
            console.log(event.target);
            startBtn.style.display = "none";
            startGame(user);
        })
    }
}

function startGame(user) {
    postGame(user);
    getSongs();
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
            console.log(game)
            currentGame = game;
            score = game.score;
            console.log(`Score: ${score}`)
            renderGameScore(currentGame);
        })
}

function renderGameScore(currentGame) {
    scoreDiv.innerHTML = `<h2>Score: ${currentGame.score}/10</h2>`
}

function getSongs() {
    fetch(SONGS_URL)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            songs = json

            // render all songs
            // songs.forEach(song => {
            //     renderSong(song)
            // });

            // render random song
            n = Math.floor(Math.random()*songs.length)
            console.log(`n = ${n} song lyrics`)
            renderLyrics(songs[n])
        })
}

function renderLyrics(song) {
    // lyricsDiv.dataset.id = song.id
    let h2 = document.createElement('h2')
    h2.innerText = `🎵${song.lyrics} 🎶`
    lyricsDiv.append(h2)
    renderSongNames(song)
}

function renderSongNames(song) {
    let optionsDiv = document.createElement('div')
    optionsDiv.setAttribute('class', 'options')

    n = Math.floor(Math.random()*songs.length)
    console.log(`n = ${n} inside renderSongNames()`)

    // need to exclude song name with lyrics already shown
    // put lyrics's song in array
    // get 3 songs
    // exclude if song.id already in array
    // add to array
    
    let randomSongs = [songs[Math.floor(Math.random()*songs.length)], songs[Math.floor(Math.random()*songs.length)], songs[Math.floor(Math.random()*songs.length)]]
    console.log(randomSongs)

    randomSongs.forEach(song => {
        optionsDiv.innerHTML += `
        <div class ="option-choice" data-song-id=${song.id}>${song.name}</div>
        `
    })

    console.log("inside renderSongNames()");
    console.log(`answer: ${song.name}`);
    optionsDiv.innerHTML += `
    <div class ="option-choice" data-song-id=${song.id}>${song.name}</div>
    `

    songNamesDiv.append(optionsDiv)
    optionsDiv.addEventListener('click', (event) => {
        console.log(`Selected song id: ${event.target.dataset.songId}`);
        console.log(`Correct song id: ${song.id}`);
        if (parseInt(event.target.dataset.songId, 10) === song.id) {
            console.log('correct');
            updateGameScore(currentGame)
            // make div green, display Correct!
        } else {
            console.log('wrong');
            // make div red, display Nope.
        }
    })
}

function updateGameScore(currentGame) {
    console.log(`Current game id from inside updateGameScore(): ${currentGame.id}`);
    console.log(`Score before patch request: ${currentGame.score}`);

    let newScore = currentGame.score + 1
    
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


// add event listeners
// regardless if correct/incorrect, load another lyrics question until 10 rounds complete
// preventDefault
// add serializers