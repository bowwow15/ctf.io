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
    	when "get_self_uuid"
    		Player.self_uuid = data.uuid;
    	when "get_players"
    		Game.players = eval(data.players);
    	when "player_died"
    		@perform 'unsubscribed'
    		Player.die();

  start_game: (name) ->
    @perform 'start_game', name: name
    Start();

  broadcast_name: (name) ->
  	@perform 'broadcast_name', name: name

  move_player: (coords) ->
  	@perform 'move_player', coords: coords

  get_name: () ->
  	@perform 'get_name'

  get_self_uuid: () ->
  	@perform 'get_self_uuid'

  get_players: () ->
  	@perform 'get_players'

  get_player_coords: (targetUuid) ->
  	@perform 'get_player_coords', targetUuid: targetUuid