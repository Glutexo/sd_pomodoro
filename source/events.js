(function() {
    const TARGET_HARDWARE_AND_SOFTWARE = 0;

    function rawEvent(eventType, other = {}) {
        return {"event": eventType, ...other}
    }

    function contextEvent(context, eventType, payload) {
        return rawEvent(eventType, {"context": context, "payload": payload})
    }

    window.streamDeckEvents = {
        open: (eventType, pluginUUID) => {
            return rawEvent(eventType, {"uuid": pluginUUID})
        },
        setTitle: (context, title) => {
            const payload = {
                "title": `${title}`, // Converts to a string.
                "target": TARGET_HARDWARE_AND_SOFTWARE
            }
            return contextEvent(context, "setTitle", payload)
        },
        setSettings: (context, settings) => {
            return contextEvent(context, "setSettings", settings)
        }
    }
})();
