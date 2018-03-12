class Inventory < ApplicationRecord
	$default_inventory = ["empty", "glock_19", "ar_15", "empty", "empty", "empty", "empty", "empty"]

	$all_guns = ["glock_19", "ar_15"]

	def get_inventory
		$default_inventory
	end

	def get_all_guns
		$all_guns
	end
end
