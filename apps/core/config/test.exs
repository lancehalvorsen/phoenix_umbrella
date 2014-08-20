use Mix.Config

config :phoenix, Core.Router,
  port: System.get_env("PORT") || 4001,
  ssl: false,
  cookies: true,
  consider_all_requests_local: true,
  session_key: "_core_key",
  session_secret: "9S+D8%#$1XXOXLDNY+_1YO@P8Y3N%T%G42Q=+=Z6N9NUYLP%7%LZ*T4RTU8=DU*UK=1Q(V@@E1@3K"

config :phoenix, :code_reloader,
  enabled: true

config :logger, :console,
  level: :debug


