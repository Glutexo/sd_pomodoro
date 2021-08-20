(function() {
    function connectWebSocket(port) {
        const webSocket = new WebSocket(`ws://127.0.0.1:${port}`);

        function send(data) {
            const json = JSON.stringify(data);
            webSocket.send(json);
        }

        return {
            bindOpen: (eventType, pluginUUID) => {
                webSocket.onopen = () => {
                    const event = window.streamDeckEvents.open(eventType, pluginUUID)
                    send(event);
                };
            },
            bindMessage: (onMessage) => {
                webSocket.onmessage = (event) => {
                    function sendEvent(context, eventType, payload) {
                        const event = window.streamDeckEvents.event(context, eventType, payload)
                        send(event);
                    }

                    const eventData = JSON.parse(event.data);
                    onMessage(sendEvent, eventData)
                };
            }
        };
    }

    window.registerStreamDeck = function(onMessage) {
        return (port, pluginUUID, event, _info) => {
            const webSocket = connectWebSocket(port)
            webSocket.bindOpen(event, pluginUUID)
            webSocket.bindMessage(onMessage)
        };
    }
})();
