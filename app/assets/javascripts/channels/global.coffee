App.global = App.cable.subscriptions.create "GlobalChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    switch data.action
    	when "send_player_data"
    		#draw player at coords
    		OnlinePlayers[data.uuid] = eval(data.playerData); #eval turns data into array

    	when "send_player_name"
    		#send the player's name to all online players
    		OnlinePlayers[data.uuid + "_name"] = data.name;

    	when "send_dropped_items"
    		Map.droppedItems = eval(data.items)

    	when "send_map_bunkers"
    		Obsticle.drawServerBunkers(data.bunkersArray);

    	when "send_map_trees"
    		Obsticle.drawServerTrees(data.treesArray);

    	when "send_bullets"
    		Game.bullets.push(eval(data.bullets));

    	when "delete_bullet"
    		Game.deleteBullet(data.index);

    	when "delete_player"
    		delete OnlinePlayers[data.uuid]; #deletes user from local object

    	when "player_died"
    		Game.addGraveStone(data.player);

    	when "play_audio"
    		Game.playAudio(data.audio, data.x, data.y, true);


  delete_bullet: (index) ->
  	#Game.bullets.splice(index, 1); #deletes bullet from all the clients
  	@perform 'delete_bullet', index: index
