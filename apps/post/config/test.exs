use Mix.Config

config :phoenix, Post.Router,
  port: System.get_env("PORT") || 4001,
  ssl: false,
  cookies: true,
  consider_all_requests_local: true,
  session_key: "_post_key",
  session_secret: "_R6BXY&5HNMT=F034(&QNZV^W3$E59=%89J%S6PS%OVM!ODXVZPG$K01@ZUSCWGVW)P@)K"

config :phoenix, :code_reloader,
  enabled: true

config :logger, :console,
  level: :debug


