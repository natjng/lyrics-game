class GamesController < ApplicationController
    def index
        games = Game.all
        render json: GameSerializer.new(games)
    end

    def show
        game = Game.find_by(id: params[:id])
        render json: GameSerializer.new(game)
    end

    def create
        game = Game.create(game_params(:score, :user_id))
        render json: GameSerializer.new(game)
    end

    def update
        game = Game.find_by(id: params[:id])
        game.update(game_params(:score))
        render json: GameSerializer.new(game)
    end

    private

    def game_params(*args)
        params.require(:game).permit(*args)
    end
end
