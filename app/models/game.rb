class Game < ApplicationRecord
	def self.start (uuid, name)
		REDIS.set("player_name_#{uuid}", name)
	end

	def self.delete_user (uuid)
		REDIS.del("coords_for_#{uuid}")
		REDIS.del("player_name_#{uuid}") #deletes user when disconects
	end

	def self.move_player (uuid, coords)
		#sets player location in database
		REDIS.set("coords_for_#{uuid}", coords)
	end

	def self.get_name (uuid)
		name = REDIS.get("player_name_#{uuid}")

		return name
	end
end
