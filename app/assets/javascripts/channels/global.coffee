App.global = App.cable.subscriptions.create "GlobalChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    switch data.action
    	when "send_player_coords"
    		#draw player at coords
    		OnlinePlayers[data.uuid] = [eval(data.coords), data.name]; #eval turns data into array
    	when "delete_player"
    		delete OnlinePlayers[data.uuid] #deletes user from local object
