class Global < ApplicationRecord
	def self.start_game (uuid, name)
		name.slice! 15..-1 #limits name length to 15 characters

		REDIS.set("player_name_#{uuid}", name)

		REDIS.set("coords_for_#{uuid}", coords)

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}

		#sends list of players
		REDIS.keys("player_name_*").each do |k|
			name = REDIS.get(k)

			uuid = k.split("player_name_")[1]

			ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}
		end

	end

	def self.move_player (uuid, coords)
		#sets player location in database

		ActionCable.server.broadcast "global", {action: "send_player_coords", uuid: uuid, coords: coords}
		
		if REDIS.get("player_name_#{uuid}") #only move is player exists
			REDIS.set("coords_for_#{uuid}", coords) #only move if coordinates aren't equal to last coorinates
		end
	end

	def self.broadcast_name (uuid, name)

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}
	end
end
