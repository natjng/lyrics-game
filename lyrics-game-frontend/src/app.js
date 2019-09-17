class App {
    constructor(baseURL) {
        this.BASE_URL = baseURL
        this.SONGS_URL = `${this.BASE_URL}/songs`
        this.USERS_URL = `${this.BASE_URL}/users`
        this.GAMES_URL = `${this.BASE_URL}/games`
        this.main = document.querySelector('main')
        this.welcome = document.querySelector('.welcome')
        this.loginContainer = document.querySelector('.login-container')
        this.submitBtn = document.querySelector('.submit')
        this.gameControl = document.querySelector('.game-control')
        this.startBtn = document.querySelector('#startBtn')
        this.gameContainer = document.querySelector('.game-container')
        this.lyricsDiv = document.querySelector('.lyrics')
        this.songNamesDiv = document.querySelector('.song-names')
        this.loginForm = false
        this.currentUser
        this.currentUserGames
        this.currentGame
        this.songs
        this.gameSongs
        this.songCounter
        this.currentSong
        this.score

        this.gameControl.style.display = "none";
        this.lyricsDiv.style.display = 'none';

        this.loginContainer.addEventListener('submit', this.handleLogin)
        this.startBtn.addEventListener('click', this.handleStartBtn)
        this.songNamesDiv.addEventListener('click', this.handleOption)
    }

    handleLogin = (event) => {
        event.preventDefault();
        this.postUser(event.target.username.value);
    }

    getSongs() {
        fetch(this.SONGS_URL)
            .then(res => res.json())
            .then(json => { 
                this.songs = json.data.map(s => new Song(s))
            })
    }

    postUser = (username) => {
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({username})
        }
        fetch(this.USERS_URL, configObj)
            .then(res => res.json())
            .then(json => {
                this.currentUser = new User(json.data);
                this.currentUser.renderUser();
                this.gameControl.style.display = "block";
                this.loginContainer.style.display = 'none';
                this.welcome.style.display = 'none';
            })
    }

    handleStartBtn = () => {
        this.gameControl.style.display = "none";
        this.gameContainer.style.display = "block";
        this.startGame();
    }

    shuffleSongs = (songs) => {
        let m = songs.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = songs[m];
            songs[m] = songs[i];
            songs[i] = t;
        }
        return songs;
    }

    startGame = () => {
        this.songCounter = 0;
        this.postGame();
        this.gameSongs = this.shuffleSongs(this.songs).slice(0, 10);
        console.log(this.gameSongs);
        this.renderLyrics(this.gameSongs[this.songCounter]);
    }

    postGame = () => {
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({score: 0, user_id: this.currentUser.id})
        }
        fetch(this.GAMES_URL, configObj)
            .then(res => res.json())
            .then(game => {
                this.currentGame = new Game(game.data);
                console.log("currentGame", this.currentGame)
                this.currentGame.renderGameScore();
            })
    }

    renderLyrics = (song) => {
        this.lyricsDiv.style.display = 'inline-block';
        this.lyricsDiv.innerHTML = `<h1>${song.getLyrics()}</h1>`
        this.renderSongNames(song)
        this.songCounter += 1;
        this.currentSong = song;
    }

    renderSongNames = (song) => {
        let songOptions = this.songs.filter(s => s !== song);
        let options = this.shuffleSongs(songOptions).slice(0, 3);
        options.push(song);
        let shuffledOptions = this.shuffleSongs(options);
        this.songNamesDiv.style.backgroundColor = ''
        this.songNamesDiv.innerHTML = ''

        shuffledOptions.forEach(option => {
            this.songNamesDiv.innerHTML += `
            <div class="option hvr-grow" data-song-id=${option.id}>${option.getName()}</div><br>
            `
        })
    }

    handleOption = (event) => {
        let selectedDiv = event.target
        if (parseInt(selectedDiv.dataset.songId, 10) === parseInt(this.currentSong.id, 10)) {
            selectedDiv.innerText = "🎉YAS"
            selectedDiv.style.backgroundColor = "#479679"
            this.updateGameScore()
            this.checkGameOver()
        } else {
            selectedDiv.innerText = "c'mon now 😔"
            selectedDiv.style.backgroundColor = "#e04a4a"
            this.checkGameOver()
        }
    }

    checkGameOver = () => {
        if (this.songCounter === 10) {
            setTimeout( () => {
                this.lyricsDiv.innerHTML = `<h1>End Game.</h1><h3>🎵I wanna be your endgame... 🎵</h3>`;
                this.songNamesDiv.innerHTML = ''
                this.gameControl.style.display = "block";
                this.postUser(this.currentUser.username)
            }, 500)
        } else {
            setTimeout( () => this.renderLyrics(this.gameSongs[this.songCounter]), 500)
        }
    }

    updateGameScore = () => {
        let newScore = this.currentGame.score += 1
        
        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({score: newScore})
        }
        fetch(`${this.GAMES_URL}/${this.currentGame.id}`, configObj)

        this.currentGame.renderGameScore();
    }

}