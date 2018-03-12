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

    	when "delete_player"
    		delete OnlinePlayers[data.uuid]; #deletes user from local object
