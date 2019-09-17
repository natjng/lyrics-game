class Song {
    constructor(song) {
        this.id = song.id
        this.name = song.attributes.name
        this.lyrics = song.attributes.lyrics
        
        // maybe better to put songs array in each new game obj
        // then make an instance of each song from songs array

        // this.gameContainer = document.querySelector('.game-container')
        // this.lyricsDiv = document.querySelector('.lyrics')
        // this.songNamesDiv = document.querySelector('.song-names')

        // this.songs;
        // this.gameSongs;
        // this.songCounter;
        // this.currentSong;
    }

    getName() {
        return this.name
    }

    getLyrics() {
        return this.lyrics
    }

}