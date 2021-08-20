(function() {
    function connectWebSocket(port) {
        const webSocket = new WebSocket(`ws://127.0.0.1:${port}`);

        function send(data) {
            console.debug("WebSocket send", data)
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
                    function sendEvent(context, eventFunc, ...args) {
                        const event = eventFunc(context, ...args)
                        send(event);
                    }

                    const eventData = JSON.parse(event.data);
                    console.debug("WebSocket receive", eventData)
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
