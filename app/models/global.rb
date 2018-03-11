class Global < ApplicationRecord
	@player_speed = 500;

	def self.start_game (uuid, name, coords)
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
		
		if REDIS.get("player_name_#{uuid}") #only move is player exists
			coordsFromDatabase = eval(REDIS.get("coords_for_#{uuid}"))

			absolutePlayerMovement = (coordsFromDatabase[0] - coords[0]) + (coordsFromDatabase[1] - coords[1])
			absolutePlayerMovement = absolutePlayerMovement.abs

			#makes sure player doesn't move too fast
			#if absolutePlayerMovement < @player_speed
				ActionCable.server.broadcast "global", {action: "send_player_coords", uuid: uuid, coords: coords}

				REDIS.set("coords_for_#{uuid}", coords) #only move if coordinates aren't equal to last coorinates
			#end
		end
	end

	def self.broadcast_name (uuid, name)

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}
	end
end
