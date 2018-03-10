# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameChannel < ApplicationCable::Channel
  def subscribed
     stream_from "player_#{uuid}"
  end

  def unsubscribed
  	#when client disconnects, delete player.
  	Game.delete_user(uuid)
    #disconnect
  end

  def start (uuid, name)
    #commands
    Game.start(uuid, name)
  end

  def move_player (coords)
  	#commands
  	Game.move_player(uuid, coords)
  end

  def get_name
  	return Game.get_name(uuid)
  end
end
