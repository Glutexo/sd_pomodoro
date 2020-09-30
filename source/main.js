(function() {
    const TARGET_HARDWARE_AND_SOFTWARE = 0;
    const LONG_PRESS_MS = 500;
    const POMODORO_TICK_MS = 1000;
    const POMODORO_INITIAL_SECONDS = 60;

    const EVENT_KEY_DOWN = "keyDown"
    const EVENT_KEY_UP = "keyUp"
    const EVENT_WILL_APPEAR = "willAppear"

    const actions = {
        onKeyDown: function(webSocket, context, coordinates, userDesiredState) {
            keyPressTimer = setTimeout(function () {
                longPress = true;
                clearInterval(pomodoroTimer)
                pomodoroTimer = null;
                _setPomodoroSeconds(context, POMODORO_INITIAL_SECONDS)
            }, LONG_PRESS_MS);
        },

        onKeyUp: function(webSocket, context, coordinates, userDesiredState) {
            clearTimeout(keyPressTimer);
            keyPressTimer = null;

            if (longPress) {
                longPress = false;
                return
            }

            _togglePomodoroTimer(webSocket, context)
        },

        onWillAppear: function(webSocket, context, coordinates) {
            _setPomodoroSeconds(webSocket, context, POMODORO_INITIAL_SECONDS)
        },
    }

    let keyPressTimer = null;
    let longPress = false;

    let pomodoroTimer = null;
    let settings = null;

    function _pomodoroTick(webSocket, context) {
        _setPomodoroSeconds(webSocket, context, settings["pomodoroSeconds"] - 1)
    }

    function _togglePomodoroTimer(webSocket, context) {
        function __pomodoroTick() {
            _pomodoroTick(webSocket, context);
        }

        if (pomodoroTimer) {
            clearInterval(pomodoroTimer);
            pomodoroTimer = null;
        } else {
            pomodoroTimer = setInterval(__pomodoroTick, POMODORO_TICK_MS)
        }
    }

    function _setPomodoroSeconds(webSocket, context, pomodoroSeconds) {
        if (settings == null) {
            settings = {}
        }
        settings["pomodoroSeconds"] = pomodoroSeconds
        _setSettings(webSocket, context, settings);
        _setTitle(webSocket, context, pomodoroSeconds);
    }

    function _setSettings(webSocket, context, settings) {
        _sendEvent(webSocket, "setSettings", context, settings)
    }

    function _setTitle(webSocket, context, title) {
        const payload = {
            "title": "" + title,
            "target": TARGET_HARDWARE_AND_SOFTWARE
        }
        _sendEvent(webSocket, "setTitle", context, payload)
    }


    function _sendEvent(webSocket, event, context, payload) {
        const data = {
            "event": event,
            "context": context,
            "payload": payload
        };
        const json = JSON.stringify(data)
        webSocket.send(json);
    }

    window.pomodoroOnMessage = function(webSocket, event) {
        if (event["event"] === EVENT_KEY_DOWN) {
            settings = event["payload"]["settings"]
            actions.onKeyDown(
                webSocket,
                event["context"],
                event["payload"]["coordinates"],
                event["payload"]["userDesiredState"],
            );
        } else if (event["event"] === EVENT_KEY_UP) {
            settings = event["payload"]["settings"]
            actions.onKeyUp(
                webSocket,
                event["context"],
                event["payload"]["coordinates"],
                event["payload"]["userDesiredState"],
            );
        } else if (event["event"] === EVENT_WILL_APPEAR) {
            settings = event["payload"]["settings"]
            actions.onWillAppear(
                webSocket,
                event["context"],
                event["payload"]["coordinates"],
            );
        }
    }
})();
