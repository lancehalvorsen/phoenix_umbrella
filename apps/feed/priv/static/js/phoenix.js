// Generated by CoffeeScript 1.7.1
(function() {
  (function(root, factory) {
    if (typeof define === "function" && define.amd) {
      return define(["phoenix"], factory);
    } else if (typeof exports === "object") {
      return factory(exports);
    } else {
      return factory((root.Phoenix = {}));
    }
  })(this, function(exports) {
    exports.Channel = (function() {
      Channel.prototype.bindings = null;

      function Channel(channel, topic, message, callback, socket) {
        this.channel = channel;
        this.topic = topic;
        this.message = message;
        this.callback = callback;
        this.socket = socket;
        this.reset();
      }

      Channel.prototype.reset = function() {
        return this.bindings = [];
      };

      Channel.prototype.on = function(event, callback) {
        return this.bindings.push({
          event: event,
          callback: callback
        });
      };

      Channel.prototype.isMember = function(channel, topic) {
        return this.channel === channel && this.topic === topic;
      };

      Channel.prototype.off = function(event) {
        var bind;
        return this.bindings = (function() {
          var _i, _len, _ref, _results;
          _ref = this.bindings;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            bind = _ref[_i];
            if (bind.event !== event) {
              _results.push(bind);
            }
          }
          return _results;
        }).call(this);
      };

      Channel.prototype.trigger = function(triggerEvent, msg) {
        var callback, event, _i, _len, _ref, _ref1, _results;
        _ref = this.bindings;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], event = _ref1.event, callback = _ref1.callback;
          if (event === triggerEvent) {
            _results.push(callback(msg));
          }
        }
        return _results;
      };

      Channel.prototype.send = function(event, message) {
        return this.socket.send({
          channel: this.channel,
          topic: this.topic,
          event: event,
          message: message
        });
      };

      Channel.prototype.leave = function(message) {
        if (message == null) {
          message = {};
        }
        this.socket.leave(this.channel, this.topic, message);
        return this.reset();
      };

      return Channel;

    })();
    exports.Socket = (function() {
      Socket.prototype.conn = null;

      Socket.prototype.endPoint = null;

      Socket.prototype.channels = null;

      Socket.prototype.sendBuffer = null;

      Socket.prototype.sendBufferTimer = null;

      Socket.prototype.flushEveryMs = 50;

      Socket.prototype.reconnectTimer = null;

      Socket.prototype.reconnectAfterMs = 5000;

      function Socket(endPoint) {
        this.endPoint = endPoint;
        this.channels = [];
        this.sendBuffer = [];
        this.resetBufferTimer();
        this.reconnect();
      }

      Socket.prototype.close = function(callback) {
        if (this.conn != null) {
          this.conn.onclose = (function(_this) {
            return function() {};
          })(this);
          this.conn.close();
          this.conn = null;
        }
        return typeof callback === "function" ? callback() : void 0;
      };

      Socket.prototype.reconnect = function() {
        return this.close((function(_this) {
          return function() {
            _this.conn = new WebSocket(_this.endPoint);
            _this.conn.onopen = function() {
              return _this.onOpen();
            };
            _this.conn.onerror = function(error) {
              return _this.onError(error);
            };
            _this.conn.onmessage = function(event) {
              return _this.onMessage(event);
            };
            return _this.conn.onclose = function(event) {
              return _this.onClose(event);
            };
          };
        })(this));
      };

      Socket.prototype.resetBufferTimer = function() {
        clearTimeout(this.sendBufferTimer);
        return this.sendBufferTimer = setTimeout(((function(_this) {
          return function() {
            return _this.flushSendBuffer();
          };
        })(this)), this.flushEveryMs);
      };

      Socket.prototype.onOpen = function() {
        clearInterval(this.reconnectTimer);
        return this.rejoinAll();
      };

      Socket.prototype.onClose = function(event) {
        if (typeof console.log === "function") {
          console.log("WS close: " + event);
        }
        clearInterval(this.reconnectTimer);
        return this.reconnectTimer = setInterval(((function(_this) {
          return function() {
            return _this.reconnect();
          };
        })(this)), this.reconnectAfterMs);
      };

      Socket.prototype.onError = function(error) {
        return typeof console.log === "function" ? console.log("WS error: " + error) : void 0;
      };

      Socket.prototype.connectionState = function() {
        var _ref, _ref1;
        switch ((_ref = (_ref1 = this.conn) != null ? _ref1.readyState : void 0) != null ? _ref : 3) {
          case 0:
            return "connecting";
          case 1:
            return "open";
          case 2:
            return "closing";
          case 3:
            return "closed";
        }
      };

      Socket.prototype.isConnected = function() {
        return this.connectionState() === "open";
      };

      Socket.prototype.rejoinAll = function() {
        var chan, _i, _len, _ref, _results;
        _ref = this.channels;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chan = _ref[_i];
          _results.push(this.rejoin(chan));
        }
        return _results;
      };

      Socket.prototype.rejoin = function(chan) {
        var channel, message, topic;
        chan.reset();
        channel = chan.channel, topic = chan.topic, message = chan.message;
        this.send({
          channel: channel,
          topic: topic,
          event: "join",
          message: message
        });
        return chan.callback(chan);
      };

      Socket.prototype.join = function(channel, topic, message, callback) {
        var chan;
        chan = new Phoenix.Channel(channel, topic, message, callback, this);
        this.channels.push(chan);
        if (this.isConnected()) {
          return this.rejoin(chan);
        }
      };

      Socket.prototype.leave = function(channel, topic, message) {
        var c;
        if (message == null) {
          message = {};
        }
        this.send({
          channel: channel,
          topic: topic,
          event: "leave",
          message: message
        });
        return this.channels = (function() {
          var _i, _len, _ref, _results;
          _ref = this.channels;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            if (!(c.isMember(channel, topic))) {
              _results.push(c);
            }
          }
          return _results;
        }).call(this);
      };

      Socket.prototype.send = function(data) {
        var callback;
        callback = (function(_this) {
          return function() {
            return _this.conn.send(JSON.stringify(data));
          };
        })(this);
        if (this.isConnected()) {
          return callback();
        } else {
          return this.sendBuffer.push(callback);
        }
      };

      Socket.prototype.flushSendBuffer = function() {
        var callback, _i, _len, _ref;
        if (this.isConnected() && this.sendBuffer.length > 0) {
          _ref = this.sendBuffer;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            callback();
          }
          this.sendBuffer = [];
        }
        return this.resetBufferTimer();
      };

      Socket.prototype.onMessage = function(rawMessage) {
        var chan, channel, event, message, topic, _i, _len, _ref, _ref1, _results;
        if (typeof console.log === "function") {
          console.log(rawMessage);
        }
        _ref = JSON.parse(rawMessage.data), channel = _ref.channel, topic = _ref.topic, event = _ref.event, message = _ref.message;
        _ref1 = this.channels;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          chan = _ref1[_i];
          if (chan.isMember(channel, topic)) {
            _results.push(chan.trigger(event, message));
          }
        }
        return _results;
      };

      return Socket;

    })();
    return exports;
  });

}).call(this);
