class Global < ApplicationRecord
	@inventory = Inventory.new

	@inventory.draw_dropped_items

	def self.start_game (uuid, name, coords)
		name.slice! 15..-1 #limits name length to 15 characters

		playerInventory = @inventory.get_inventory

		REDIS.set("player_name_#{uuid}", name) #your player's name

		REDIS.set("coords_for_#{uuid}", coords) #your player's coordinates

		REDIS.set("player_inventory_#{uuid}", playerInventory) #your player's inventory

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}

		droppedItems = REDIS.get("global_dropped_items")

		ActionCable.server.broadcast "global", {action: "send_dropped_items", uuid: uuid, items: droppedItems}

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

	def self.delete_bullet (uuid, index)
		ActionCable.server.broadcast "global", {action: "delete_bullet", uuid: uuid, index: index}
	end

	def self.broadcast_name (uuid, name)

		ActionCable.server.broadcast "global", {action: "send_player_name", uuid: uuid, name: name}
	end
end
