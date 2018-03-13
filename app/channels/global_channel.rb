class GlobalChannel < ApplicationCable::Channel
  def subscribed
    stream_from "global"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    Game.delete_user(uuid)
  end

  def delete_bullet (data)
  	Global.delete_bullet(uuid, data['index'])
  end
end
