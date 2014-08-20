defmodule Feed.Router do
  use Phoenix.Router

  get "/", Feed.PageController, :index, as: :pages

end
