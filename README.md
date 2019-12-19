# Name that Song (Lyrics Game)

Name that Song is a lyrics game made with a plain JavaScript, custom CSS, and HTML frontend and a Rails backend API.

Users can enter a username to start playing. Random lyrics from the database are selected for each game. Users must match the song title to the lyrics to receive a point. When logged in, a user's high score is displayed and updates when a new high score is achieved.

Here's a [demo video](https://youtu.be/C3CV73L0hrs).

## Installation

Clone repository. 

In your terminal, cd to the cloned file. 

Run `bundle install` and `rails db:migrate`. 

You may also run `rails db:seed` to seed the database with some starter data.

Run `rails s` to start your server and visit [http://localhost:3000](http://localhost:3000).

## Usage

A user can enter a username to create an account or login to start playing. Random lyrics from the database are selected for each game. A game has ten rounds. Users must match the song title to the lyrics to receive a point. When logged in, a user's high score is displayed and updates when a new high score is attained.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/natjng/lyrics-game. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Lyrics Game project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/natjng/lyrics-game/blob/master/CODE_OF_CONDUCT.md).
