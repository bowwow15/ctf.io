class Game < ApplicationRecord
	def self.start
	end

	def self.move_player (uuid, coords)
		#sets player location in database
		REDIS.set("coords_for_#{uuid}", coords)
	end
end
