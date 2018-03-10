App.game = App.cable.subscriptions.create "GameChannel",
  connected: ->
    # Called when the subscription is ready for use on the server
  disconnected: ->
    # Called when the subscription has been terminated by the server

    EndGame();

  received: (data) ->

    switch data.action
    	when "get_name"
    		Player.name = data.name;

  start_game: (name) ->
    @perform 'start_game', name: name
    Start();

  move_player: (coords) ->
  	@perform 'move_player', coords: coords

  get_name: () ->
  	@perform 'get_name'