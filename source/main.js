(function() {
    const TARGET_HARDWARE_AND_SOFTWARE = 0;
    const LONG_PRESS_MS = 500;
    const POMODORO_TICK_MS = 1000;
    const POMODORO_INITIAL_SECONDS = 60;

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

    function _setPomodoroSeconds(sendEvent, pomodoroSeconds) {
        settings = {"pomodoroSeconds": pomodoroSeconds}
        _setSettings(sendEvent, settings);
        _setTitle(sendEvent, pomodoroSeconds);
    }

    function _setSettings(sendEvent, settings) {
        sendEvent("setSettings", settings)
    }

    function _setTitle(sendEvent, title) {
        const payload = {
            "title": `${title}`,
            "target": TARGET_HARDWARE_AND_SOFTWARE
        }
        sendEvent("setTitle", payload)
    }

    window.pomodoroOnMessage = function(webSocketSendEvent, event) {
        function sendEvent(eventType, payload) {
            webSocketSendEvent(event["context"], eventType, payload);
        }

        const eventType = event["event"],
            action = actions[eventType];
        if (action) {
            action(sendEvent);
        }
    }
})();
