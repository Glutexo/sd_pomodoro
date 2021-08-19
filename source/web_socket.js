(function() {
    function connectWebSocket(port) {
        const webSocket = new WebSocket(`ws://127.0.0.1:${port}`);

        function send(data) {
            const json = JSON.stringify(data);
            webSocket.send(json);
        }

        return {
            bindOpen: (event, pluginUUID) => {
                const payload = {"event": event, "uuid": pluginUUID}
                webSocket.onopen = () => { send(payload); };
            },
            bindMessage: (onMessage) => {
                webSocket.onmessage = (event) => {
                    function sendEvent(context, eventType, payload) {
                        const data = {
                            "context": context,
                            "event": eventType,
                            "payload": payload
                        };
                        send(data);
                    }

                    const eventData = JSON.parse(event.data);
                    onMessage(sendEvent, eventData)
                };
            }
        };
    }

    window.registerStreamDeck = function(onMessage) {
        window.connectElgatoStreamDeckSocket = (port, pluginUUID, event, info) => {
            const webSocket = connectWebSocket(port)
            webSocket.bindOpen(event, pluginUUID)
            webSocket.bindMessage(onMessage)
        };
    }
})();
