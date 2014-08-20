defmodule Post.Router do
  use Phoenix.Router

  get "/", Post.PageController, :index, as: :pages

end
