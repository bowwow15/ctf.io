class AjaxController < ApplicationController
	layout false

	$hud = ["test", "test2", "test3"]

	def getHUD

	end

	def getMap
		$mapLimit = [50000, 50000] # [x, y]
		$spawnPoint = [50, 50]
	end
end
