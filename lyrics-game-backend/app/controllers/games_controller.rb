class GamesController < ApplicationController
    def index
        games = Game.all
        render json: games
    end

    def show
        game = Game.find_by(id: params[:id])
        render json: game
    end

    def create
        game = Game.create(game_params(:score, :user_id))
        render json: game
    end

    def update
        game = Game.find_by(id: params[:id])
        game.update(game_params(:score))
        render json: game
    end

    private

    def game_params(*args)
        params.require(:game).permit(*args)
    end
end
