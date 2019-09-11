const BASE_URL = "http://localhost:3000"
const SONGS_URL = `${BASE_URL}/songs`
const USERS_URL = `${BASE_URL}/users`
const main = document.querySelector('main')
const loginBtn = document.querySelector('#login')
const loginContainer = document.querySelector('.login-container')
const submitBtn = document.querySelector('.submit')
const lyricsDiv = document.querySelector('.lyrics')
const songNamesDiv = document.querySelector('.song-names')
const scoreDiv = document.querySelector('.score')
let songs;
let loginForm = false;

loginBtn.addEventListener('click', () => {
    loginForm = !loginForm
    if (loginForm) {
        loginContainer.style.display = 'block';
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
        .then(json => console.log(json))
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
}

getSongs()


// add event listeners
// check for correct answer on click
// show green if correct, red if incorrect
// increment score if correct
// regardless if correct/incorrect, load another lyrics question until 10 rounds complete
// fetch - create new score when game sarts (create)
// fetch - get request for score (read)
// fetch - patch request for score (update)
// reventDefault

// show welcome / sign in page?
// 'Start' game will getSongs()