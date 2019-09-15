class UsersController < ApplicationController
    def show
        user = User.find_by(id: params[:id])
        options = {
            include: [:games]
        }
        render json: UserSerializer.new(user, options)
    end

    def create
        user = User.find_or_create_by(user_params)
        options = {
            include: [:games]
        }
        render json: UserSerializer.new(user, options)
    end

    private

    def user_params
        params.require(:user).permit(:username)
    end
end
