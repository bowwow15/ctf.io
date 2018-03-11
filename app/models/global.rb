class Global < ApplicationRecord
	def self.move_player (uuid, coords)
		#sets player location in database

		REDIS.set("coords_for_#{uuid}", coords) #only move if coordinates aren't equal to last coorinates

		name = REDIS.get("player_name_#{uuid}")

		ActionCable.server.broadcast "global", {action: "send_player_coords", uuid: uuid, name: name, coords: coords}
	end
end
