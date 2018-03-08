class AjaxController < ApplicationController
	layout false

	$hud = ["test", "test2", "test3", "test", "test", "test", "rest", "tseds"]

	def getHUD

	end

	def getMap
		$mapLimit = [5000, 5000] # [x, y]
		$spawnPoint = [rand(0 .. $mapLimit[0]), rand(0 .. $mapLimit[1])] # [x, y]
	end
end
