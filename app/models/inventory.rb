class Inventory < ApplicationRecord
	$default_inventory = ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"]

	$all_guns = ["glock_19", "ar_15", "remington_870", "ak_47", "mac_11", "barrett_m82a1", "bomb", "the_orion"]

	$op_guns = ["barrett_m82a1", "the_orion"]

	$droppedItems = []

	def get_inventory
		$default_inventory
	end

	def get_all_guns
		$all_guns

		return $all_guns
	end

	def delete_expired_items
		droppedItemsFromDatabase = eval(REDIS.get("global_dropped_items"))

		droppedItemsFromDatabase.each do |i|
			expiration = i[3]
			if expiration != "infinite"
				if expiration < Time.now.to_i #if item has expired
					droppedItemsFromDatabase.delete_at(droppedItemsFromDatabase.index(i))
				end
			end
		end

		REDIS.set("global_dropped_items", droppedItemsFromDatabase)

		$dropped_items = droppedItemsFromDatabase
		return $dropped_items
	end

	def generate_new_item
		x = rand(150..($mapLimit[0]-150))
		y = rand(150..($mapLimit[1]-150))

		if rand(3) > 1
			@item_id = $all_guns[rand($all_guns.length - 1)] # subtract one because the orion is at the end
		else
			@item_id = "ammo"
		end

		$newItem = [x, y, @item_id, "infinite"]
		return $newItem
	end

	def draw_dropped_items
		itemsToDraw = 10
		itemCount = 0

		while itemCount <= itemsToDraw
			new_item = self.generate_new_item

			$droppedItems.push(new_item)
			itemCount += 1
		end

		droppedItemsFromDatabase = REDIS.get("global_dropped_items")

		if !droppedItemsFromDatabase
			REDIS.set("global_dropped_items", $droppedItems)
		end

		return $droppedItems
	end
end
