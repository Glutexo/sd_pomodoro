(function() {
    const TARGET_HARDWARE_AND_SOFTWARE = 0;
    const LONG_PRESS_MS = 500;
    const POMODORO_TICK_MS = 1000;
    const POMODORO_INITIAL_SECONDS = 60;

    const EVENT_KEY_DOWN = "keyDown"
    const EVENT_KEY_UP = "keyUp"
    const EVENT_WILL_APPEAR = "willAppear"

    const actions = {
        onKeyDown: function(context, coordinates, userDesiredState) {
            keyPressTimer = setTimeout(function () {
                longPress = true;
                clearInterval(pomodoroTimer)
                pomodoroTimer = null;
                _setPomodoroSeconds(context, POMODORO_INITIAL_SECONDS)
            }, LONG_PRESS_MS);
        },

        onKeyUp: function(send, context, coordinates, userDesiredState) {
            clearTimeout(keyPressTimer);
            keyPressTimer = null;

            if (longPress) {
                longPress = false;
                return
            }

            _togglePomodoroTimer(send, context)
        },

        onWillAppear: function(send, context, coordinates) {
            _setPomodoroSeconds(send, context, POMODORO_INITIAL_SECONDS)
        },
    }

    let keyPressTimer = null;
    let longPress = false;

    let pomodoroTimer = null;
    let settings = null;

    function _pomodoroTick(send, context) {
        _setPomodoroSeconds(send, context, settings["pomodoroSeconds"] - 1)
    }

    function _togglePomodoroTimer(send, context) {
        function __pomodoroTick() {
            _pomodoroTick(send, context);
        }

        if (pomodoroTimer) {
            clearInterval(pomodoroTimer);
            pomodoroTimer = null;
        } else {
            pomodoroTimer = setInterval(__pomodoroTick, POMODORO_TICK_MS)
        }
    }

    function _setPomodoroSeconds(send, context, pomodoroSeconds) {
        if (settings == null) {
            settings = {}
        }
        settings["pomodoroSeconds"] = pomodoroSeconds
        _setSettings(send, context, settings);
        _setTitle(send, context, pomodoroSeconds);
    }

    function _setSettings(send, context, settings) {
        _sendEvent(send, "setSettings", context, settings)
    }

    function _setTitle(send, context, title) {
        const payload = {
            "title": "" + title,
            "target": TARGET_HARDWARE_AND_SOFTWARE
        }
        _sendEvent(send, "setTitle", context, payload)
    }


    function _sendEvent(send, event, context, payload) {
        const data = {
            "event": event,
            "context": context,
            "payload": payload
        };
        send(data);
    }

    window.pomodoroOnMessage = function(send, event) {
        console.log("message", event)
        if (event["event"] === EVENT_KEY_DOWN) {
            settings = event["payload"]["settings"]
            actions.onKeyDown(
                event["context"],
                event["payload"]["coordinates"],
                event["payload"]["userDesiredState"],
            );
        } else if (event["event"] === EVENT_KEY_UP) {
            settings = event["payload"]["settings"]
            actions.onKeyUp(
                send,
                event["context"],
                event["payload"]["coordinates"],
                event["payload"]["userDesiredState"],
            );
        } else if (event["event"] === EVENT_WILL_APPEAR) {
            settings = event["payload"]["settings"]
            actions.onWillAppear(
                send,
                event["context"],
                event["payload"]["coordinates"],
            );
        }
    }
})();
