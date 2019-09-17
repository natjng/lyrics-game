class User {
    constructor(data) {
        this.id = data.id
        this.username = data.attributes.username
        this.highScore = data.attributes.high_score
        this.highScoreGame = data.attributes.high_score_game

        this.userDetails = document.querySelector('.user-details')
    }
    
    renderUser() {
        this.userDetails.innerHTML = ''
        let h3 = document.createElement('h3')
        h3.innerText = `💿 ${this.username}`
        this.userDetails.append(h3) 
        
        if (this.highScore) {
            let highScoreDate = new Date(this.highScoreGame.created_at)
            let highScoreDiv = document.createElement('div');
            highScoreDiv.setAttribute('class', 'high-score');
            highScoreDiv.innerHTML = `<p>Your High Score</p><h2>🏆 ${this.highScore}</h2><p>Game played on ${highScoreDate.toLocaleDateString()}</p>`
            this.userDetails.append(highScoreDiv);
        }
    }

}