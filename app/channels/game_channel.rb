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

  def start_game (data)
    Global.start_game(uuid, data['name'], data['coords'])
  end

  def get_guns
  	Game.get_guns(uuid)
  end

  def broadcast_name (data)
  	Global.broadcast_name(uuid, data['name'])
  end

  def move_player (data)
  	Global.move_player(uuid, data['playerData'])
  end

  def shoot (data)
  	Global.shoot(uuid, data['bullets'])
  end

  def send_player_health (data)
  	Game.send_player_health(uuid, data['amount'])
  end

  def player_die (data)
  	Game.player_die(uuid, data['killer_uuid'])
  end

  def get_name
  	Game.get_name(uuid)
  end

  def get_self_uuid
  	Game.get_self_uuid(uuid)
  end

  def get_players
  	Game.get_players(uuid)
  end

  def get_dropped_items
  	Game.get_dropped_items
  end

  def drop_from_inventory (data)
  	Game.drop_from_inventory(uuid, data['item'])
  end

  def delete_from_inventory (data)
  	Game.delete_from_inventory(uuid, data['item'])
  end

  def push_to_bombs (data)
  	Game.push_to_bombs(uuid, data['bombs'])
  end

  def add_to_inventory (data)
  	Game.add_to_inventory(uuid, data['item'])
  end

  def place_bomb (data)
  	Game.place_bomb(uuid, data['bomb'])
  end

  def pick_up_item (data)
  	Game.pick_up_item(uuid, data['index'])
  end

  def play_audio (data)
  	Game.play_audio(uuid, data['audio'])
  end
end
