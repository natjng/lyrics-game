class GameSerializer
  include FastJsonapi::ObjectSerializer
  attributes :score, :user_id
end
