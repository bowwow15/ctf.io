class Inventory < ApplicationRecord
	$default_inventory = ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"]

	$all_guns = ["glock_19", "ar_15", "remington_870"]

	def get_inventory
		$default_inventory
	end

	def get_all_guns
		$all_guns
	end

	def draw_dropped_items
		itemsToDraw = 15
		itemCount = 0

		$droppedItems = []

		while itemCount <= itemsToDraw
			x = rand($mapLimit[0])
			y = rand($mapLimit[1])

			item_id = $all_guns[rand($all_guns.length)]

			$droppedItems.push([x, y, item_id])
			itemCount += 1
		end

		droppedItemsFromDatabase = REDIS.get("global_dropped_items")

		if !droppedItemsFromDatabase
			REDIS.set("global_dropped_items", $droppedItems)
		end

		return $droppedItems
	end
end
