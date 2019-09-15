class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :username
  has_many :games

  attributes :highest_score do |object|
    "#{object.games.map(&:score).max}"
  end
end
