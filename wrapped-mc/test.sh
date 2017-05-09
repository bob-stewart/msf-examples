#! /bin/sh

# First run emcee as a straight-through http/https server
docker run --rm --name=wrapped-mc --privileged -d -p 80:8080 wrapped-mc -redirect=false

echo "Testing redirection disabled"

# Wait for wrapped-mc to be healthy
echo "Waiting for wrapped-mc to be healthy"
while [[ "$(docker inspect --format '{{ .State.Health.Status }}' wrapped-mc 2>/dev/null)" != "healthy" ]]; do
        sleep 5
done
echo ""

echo "Testing HTTP: "
curl http://localhost

echo "Testing websocket upgrade over HTTP: "
curl --header "Connection: Upgrade" --header "Upgrade: websocket" --header "Host: localhost" --header "Origin: http://localhost/websocket" --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" --header "Sec-WebSocket-Version: 13" http://localhost/websocket

docker kill wrapped-mc > /dev/null 2>&1

echo ""
echo "Done"
