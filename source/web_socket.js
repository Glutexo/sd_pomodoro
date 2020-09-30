(function() {
    window.registerStreamDeckConnect = function(onMessage) {
        window.connectElgatoStreamDeckSocket = function(inPort, inPluginUUID, inRegisterEvent, inInfo) {
            const webSocket = new WebSocket("ws://127.0.0.1:" + inPort);

            webSocket.onopen = function() {
                const registration = {
                    "event": inRegisterEvent,
                    "uuid": inPluginUUID
                }
                const json = JSON.stringify(registration);
                webSocket.send(json);
            };

            webSocket.onmessage = function (event) {
                // Received message from Stream Deck
                const eventData = JSON.parse(event.data);
                onMessage(webSocket, eventData)
            };

            webSocket.onclose = function() {
                // Websocket is closed
            };
        };
    }
})();
