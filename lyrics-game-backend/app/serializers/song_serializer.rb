class SongSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :lyrics
end
