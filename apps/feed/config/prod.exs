use Mix.Config

config :phoenix, Feed.Router,
  port: System.get_env("PORT"),
  ssl: false,
  host: "example.com",
  cookies: true,
  session_key: "_feed_key",
  session_secret: "IB_H59WHV)&T@M12O#173B1FV)5ZYLE1C_OO5=T^%Q5C5EYIG$1X)1C1)7TCWD4L_31#OH#OC"

config :logger, :console,
  level: :info,
  metadata: [:request_id]

