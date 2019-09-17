class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :username
  has_many :games

  attributes :high_score do |object|
    "#{object.games.map(&:score).max}"
  end

  attributes :high_score_game do |object|
    high_score = object.games.map(&:score).max
    object.games.detect{|g| g.score == high_score}
  end
end
