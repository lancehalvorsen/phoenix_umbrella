use Mix.Config

config :phoenix, Post.Router,
  port: System.get_env("PORT"),
  ssl: false,
  host: "example.com",
  cookies: true,
  session_key: "_post_key",
  session_secret: "_R6BXY&5HNMT=F034(&QNZV^W3$E59=%89J%S6PS%OVM!ODXVZPG$K01@ZUSCWGVW)P@)K"

config :logger, :console,
  level: :info,
  metadata: [:request_id]

