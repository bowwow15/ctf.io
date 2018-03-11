class Game < ApplicationRecord
	def self.start_game (uuid, name)
		name.slice! 15..-1 #limits name length to 15 characters

		REDIS.set("player_name_#{uuid}", name)
	end

	def self.delete_user (uuid)
		REDIS.del("coords_for_#{uuid}")
		REDIS.del("player_name_#{uuid}") #deletes user when disconects

		ActionCable.server.broadcast "global", {action: "delete_player", uuid: uuid, name: name}
	end

	def self.get_name (uuid)
		name = REDIS.get("player_name_#{uuid}")

		ActionCable.server.broadcast "player_#{uuid}", {action: "get_name", name: "#{name}"}
		return name
	end

	def self.get_self_uuid (uuid)
		ActionCable.server.broadcast "player_#{uuid}", {action: "get_self_uuid", uuid: "#{uuid}"}
	end

	def self.get_players (uuid)
		players = REDIS.keys('coords_for_*') #returns array (uses coords for because it only shows players that have moved.)

		index = 0
		players.each do |p|
			players[index] = p.split("coords_for_")[1] #gets uuid (after "coords_for_")
			index += 1
		end

		ActionCable.server.broadcast "player_#{uuid}", {action: "get_players", players: "#{players}"}
	end

end
