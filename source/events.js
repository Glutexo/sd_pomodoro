(function() {
    function event(eventType, other = {}) {
        return {"event": eventType, ...other}
    }

    window.streamDeckEvents = {
        open: (eventType, pluginUUID) => {
            return event(eventType, {"uuid": pluginUUID})
        },
        event: (context, eventType, payload) => {
            return event(eventType, {"context": context, "payload": payload})
        }
    }
})();
