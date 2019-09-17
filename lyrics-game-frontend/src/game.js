class Game {
    constructor(data) {
        this.id = data.id
        this.score = data.attributes.score
        this.user_id = data.attributes.user_id

        this.scoreDiv = document.querySelector('.score')
    }

    renderGameScore() {
        this.scoreDiv.innerHTML = `<h2>Score: ${this.score}/10</h2>`
    }
}