(function() {
    const LONG_PRESS_MS = 500;
    const POMODORO_TICK_MS = 1000;
    const POMODORO_INITIAL_SECONDS = 25 * 60;

    const EVENT_KEY_DOWN = "keyDown";
    const EVENT_KEY_UP = "keyUp";
    const EVENT_WILL_APPEAR = "willAppear";

    const actions = {};
    actions[EVENT_KEY_DOWN] = (sendEvent) => {
        keyPressTimer = setTimeout(function () {
            longPress = true;
            clearInterval(pomodoroTimer)
            pomodoroTimer = null;
            _setPomodoroSeconds(sendEvent, POMODORO_INITIAL_SECONDS)
        }, LONG_PRESS_MS);
    };
    actions[EVENT_KEY_UP] = (sendEvent) => {
        clearTimeout(keyPressTimer);
        keyPressTimer = null;

        if (longPress) {
            longPress = false;
            return
        }

        _togglePomodoroTimer(sendEvent)
    };
    actions[EVENT_WILL_APPEAR] = (sendEvent) => {
        _setPomodoroSeconds(sendEvent, POMODORO_INITIAL_SECONDS)
    };

    let keyPressTimer = null;
    let longPress = false;

    let pomodoroTimer = null;
    let settings = null;

    function _pomodoroTick(sendEvent) {
        _setPomodoroSeconds(sendEvent, settings["pomodoroSeconds"] - 1)
    }

    function _togglePomodoroTimer(sendEvent) {
        function __pomodoroTick() {
            _pomodoroTick(sendEvent);
        }

        if (pomodoroTimer) {
            clearInterval(pomodoroTimer);
            pomodoroTimer = null;
        } else {
            pomodoroTimer = setInterval(__pomodoroTick, POMODORO_TICK_MS)
        }
    }

    function _formatPomodoroSeconds(seconds) {
        const minutes = Math.floor(seconds / 60),
            remainingSeconds = seconds % 60,
            formattedSeconds = String(remainingSeconds).padStart(2, "0");
        return `${minutes}:${formattedSeconds}`;
    }

    function _setPomodoroSeconds(sendEvent, pomodoroSeconds) {
        settings = {"pomodoroSeconds": pomodoroSeconds};  // Global to keep local state.
        sendEvent(window.streamDeckEvents.setSettings, settings)
        sendEvent(window.streamDeckEvents.setTitle, _formatPomodoroSeconds(pomodoroSeconds))
    }

    window.pomodoroOnMessage = function(webSocketSendEvent, onMessageEvent) {
        function sendEvent(eventFunc, ...args) {
            webSocketSendEvent(onMessageEvent["context"], eventFunc, ...args);
        }

        const eventType = onMessageEvent["event"],
            action = actions[eventType];
        if (action) {
            action(sendEvent);
        }
    }
})();
