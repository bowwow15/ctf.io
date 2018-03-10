# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameChannel < ApplicationCable::Channel
  def subscribed
     stream_from "player_#{uuid}"
  end

  def unsubscribed
    #disconnect
  end

  def new_game (name)
    #commands
  end

  def move_player (coords)
  	#commands
  	Game.move_player(uuid, coords)
  end
end
