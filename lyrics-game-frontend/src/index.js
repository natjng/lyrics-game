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
            score = game.score;
            console.log(`Score: ${score}`)
            renderGameScore(game);
        })
}

function renderGameScore(game) {
    let h2 = document.createElement('h2')
    h2.innerHTML = `Score: ${game.score}/10`
    scoreDiv.append(h2)
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
    let ul = document.createElement('ul')

    n = Math.floor(Math.random()*songs.length)
    console.log(`n = ${n} inside renderSongNames()`)

    // need to exclude song name with lyrics already shown
    let randomSongs = [songs[Math.floor(Math.random()*songs.length)], songs[Math.floor(Math.random()*songs.length)], songs[Math.floor(Math.random()*songs.length)]]
    console.log(randomSongs)

    randomSongs.forEach(song => {
        ul.innerHTML += `
        <p data-song-id=${song.id}>${song.name}</p>
        `
    })

    console.log("inside renderSongNames()");
    console.log(`answer: ${song.name}`);
    ul.innerHTML += `
    <p data-song-id=${song.id}>${song.name}</p>
    `

    songNamesDiv.append(ul)
    ul.addEventListener('click', (event) => {
        console.log(`Selected song id: ${event.target.dataset.songId}`);
        console.log(`Correct song id: ${song.id}`);
        if (parseInt(event.target.dataset.songId, 10) === song.id) {
            console.log('correct');
        } else {
            console.log('wrong');
        }
    })
}




// add event listeners
// check for correct answer on click
// show green if correct, red if incorrect
// increment score if correct
// regardless if correct/incorrect, load another lyrics question until 10 rounds complete
// fetch - get request for score (read)
// fetch - patch request for score (update) updateGameScore()
// preventDefault
// add serializers