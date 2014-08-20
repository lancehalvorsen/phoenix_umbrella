defmodule Core.Router do
  use Phoenix.Router

  get "/", Core.PageController, :index, as: :pages
  get "/feed", Feed.PageController, :index
  get "/post", Post.PageController, :index

end
