class GlobalChannel < ApplicationCable::Channel
  def subscribed
    stream_from "global"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
