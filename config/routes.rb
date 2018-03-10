Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'play#index'

  get 'getHUD' => 'ajax#getHUD'

  get 'getMap' => 'ajax#getMap'

  mount ActionCable.server => "/cable" #actionCable
end
