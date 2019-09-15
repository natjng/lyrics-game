class UsersController < ApplicationController
    def show
        user = User.find_by(id: params[:id])
        options = {
            include: [:games]
        }
        render json: UserSerializer.new(user, options)
    end

    def create
        user = User.find_or_create_by(username: params[:username])
        options = {
            include: [:games]
        }
        render json: UserSerializer.new(user, options)
    end
end
