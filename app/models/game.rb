class Game < ApplicationRecord
	@inventory = Inventory.new

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

	def self.drop_from_inventory (uuid, item)
		@playerInventory = eval(REDIS.get("player_inventory_#{uuid}"))

		if @playerInventory[item[2]] != "ammo" && @playerInventory[item[2]] != "empty"
			droppedItemsFromDatabase = eval(REDIS.get("global_dropped_items"))

			droppedItemsFromDatabase.push([item[0], item[1], @playerInventory[item[2]], Time.now.to_i + 120]) # (x, y, name, expiration (120 seconds in advance))

			REDIS.set("global_dropped_items", droppedItemsFromDatabase)
			ActionCable.server.broadcast "global", {action: "send_dropped_items", items: droppedItemsFromDatabase}
		end

		@playerInventory[item[2]] = "empty"

		REDIS.set("player_inventory_#{uuid}", @playerInventory)

		ActionCable.server.broadcast "player_#{uuid}", {action: "send_player_inventory", inventory: @playerInventory}
	end

	def self.add_to_inventory (uuid, item)
		itemName = item

		playerInventory = eval(REDIS.get("player_inventory_#{uuid}"))

		emptySlot = playerInventory.index{|x|x=="empty"}

		playerInventory[emptySlot] = itemName

		REDIS.set("player_inventory_#{uuid}", playerInventory)

		ActionCable.server.broadcast "player_#{uuid}", {action: "send_player_inventory", inventory: playerInventory}
	end

	def self.pick_up_item (uuid, index)
		droppedItems = eval(REDIS.get("global_dropped_items"))

		itemToPickUp = droppedItems[index]

		add_to_inventory(uuid, itemToPickUp[2])

		droppedItems[index] = @inventory.generate_new_item #so that we don't run out of items

		REDIS.set("global_dropped_items", droppedItems)

		droppedItems = @inventory.delete_expired_items

		ActionCable.server.broadcast "global", {action: "send_dropped_items", uuid: uuid, items: droppedItems}
	end

	def self.get_dropped_items
		droppedItems = @inventory.draw_dropped_items

		ActionCable.server.broadcast "global", {action: "send_dropped_items", items: droppedItems}
	end

	def self.get_inventory (uuid, playerInventory)
		ActionCable.server.broadcast "player_#{uuid}", {action: "send_player_inventory", inventory: playerInventory} #private stream to player specified by uuid
	end

	def self.send_player_health (uuid, amount)
		if amount <= 0
			ActionCable.server.broadcast "player_#{uuid}", {action: "you_died", health: amount}

			REDIS.del("coords_for_#{uuid}")
			REDIS.del("player_name_#{uuid}") #deletes user when dead
		end
	end
end
