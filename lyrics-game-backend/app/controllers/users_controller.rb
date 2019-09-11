class UsersController < ApplicationController
    def show
        user = User.find_by(id: params[:id])
        render json: user
    end

    def create
        user = User.find_or_create_by(username: params[:username])
        render json: user
    end
end
