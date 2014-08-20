use Mix.Config

config :phoenix, Core.Router,
  port: System.get_env("PORT"),
  ssl: false,
  host: "example.com",
  cookies: true,
  session_key: "_core_key",
  session_secret: "9S+D8%#$1XXOXLDNY+_1YO@P8Y3N%T%G42Q=+=Z6N9NUYLP%7%LZ*T4RTU8=DU*UK=1Q(V@@E1@3K"

config :logger, :console,
  level: :info,
  metadata: [:request_id]

