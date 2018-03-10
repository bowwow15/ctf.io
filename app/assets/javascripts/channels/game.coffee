App.game = App.cable.subscriptions.create "GameChannel",
  connected: ->
    # Called when the subscription is ready for use on the server
  disconnected: ->
    # Called when the subscription has been terminated by the server

    EndGame();

  received: (data) ->
    # Called when there's incoming data on the websocket for this channel
    switch data.action
    	when "game_end"
    		$("#status").html("Game has ended.");

  start_game: (name) ->
    Start();
    @perform 'start', data: name

  move_player: (coords) ->
  	@perform 'move_player', data: coords

  get_name: () ->
  	name = @perform 'get_name'
  	#alert(name);