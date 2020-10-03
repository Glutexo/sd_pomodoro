(function() {
    window.registerStreamDeck = function(onMessage) {
        window.connectElgatoStreamDeckSocket = function(port, pluginUUID, event, info) {
            function connectWebSocket(inPort) {
                const webSocket = new WebSocket("ws://127.0.0.1:" + inPort);
                return {
                    bindOpen: function(event, pluginUUID) {
                        const payload = {"event": event, "uuid": pluginUUID}
                        const json = JSON.stringify(payload)
                        webSocket.onopen = () => { webSocket.send(json); };
                    },
                    bindMessage: function(onMessage) {
                        webSocket.onmessage = (event) => {
                            const eventData = JSON.parse(event.data);
                            onMessage(webSocket, eventData)
                        };
                    }
                };
            }

            const webSocket = connectWebSocket(port)
            webSocket.bindOpen(event, pluginUUID)
            webSocket.bindMessage(onMessage)
        };
    }
})();
