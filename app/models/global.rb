class Global < ApplicationRecord
	@inventory = Inventory.new

	def self.start_game (uuid, name, coords)
		name.slice! 15..-1 #limits name length to 15 characters

		REDIS.set("player_name_#{uuid}", name) #your player's name

		REDIS.set("coords_for_#{uuid}", coords) #your player's coordinates

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}

		playerInventory = @inventory.get_inventory
		ActionCable.server.broadcast "player_#{uuid}", {action: "send_player_inventory", inventory: playerInventory} #private stream to player specified by uuid

		#sends list of players
		REDIS.keys("player_name_*").each do |k|
			name = REDIS.get(k)

			uuid = k.split("player_name_")[1]

			ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}
		end

	end

	def self.move_player (uuid, playerData)
		#sets player location in database
		
		if REDIS.get("player_name_#{uuid}") #only move is player exists
			coordsFromDatabase = eval(REDIS.get("coords_for_#{uuid}"))

			absolutePlayerMovement = (coordsFromDatabase[0] - playerData[0]) + (coordsFromDatabase[1] - playerData[1])
			absolutePlayerMovement = absolutePlayerMovement.abs

			#makes sure player doesn't move too fast
			#if absolutePlayerMovement < @player_speed
				ActionCable.server.broadcast "global", {action: "send_player_data", uuid: uuid, playerData: playerData}

				REDIS.set("coords_for_#{uuid}", playerData) #only move if coordinates aren't equal to last coorinates
			#end
		end
	end

	def self.shoot (uuid, bullets)
		ActionCable.server.broadcast "global", {action: "send_bullets", uuid: uuid, bullets: bullets}
	end

	def self.broadcast_name (uuid, name)

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}
	end
end
