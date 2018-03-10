class AjaxController < ApplicationController
	cache = ActiveSupport::Cache::MemoryStore.new

	layout false

	def getHUD

	end

	def getMap
		$mapLimit = [5000, 5000] # [x, y]
		$spawnPoint = [rand(0 .. $mapLimit[0]), rand(0 .. $mapLimit[1])] # [x, y]
	end

	def movePlayer (x, y)
		$player_x = x
		$player_y = y
	end
end
