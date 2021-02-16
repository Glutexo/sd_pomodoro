(function() {

    function connectWebSocket(inPort) {
        const webSocket = new WebSocket("ws://127.0.0.1:" + inPort);

        function send(data) {
            const json = JSON.stringify(data);
            webSocket.send(json);
        }

        return {
            bindOpen: function(event, pluginUUID) {
                const payload = {"event": event, "uuid": pluginUUID}
                webSocket.onopen = () => { send(payload); };
            },
            bindMessage: function(onMessage) {
                console.log("bindMessage", webSocket)
                webSocket.onmessage = (event) => {
                    console.log("onmessage", webSocket)
                    const eventData = JSON.parse(event.data);
                    onMessage(send, eventData)
                };
            }
        };
    }

    window.registerStreamDeck = function(onMessage) {
        window.connectElgatoStreamDeckSocket = function(port, pluginUUID, event, info) {
            const webSocket = connectWebSocket(port)
            webSocket.bindOpen(event, pluginUUID)
            webSocket.bindMessage(onMessage)
        };
    }
})();
