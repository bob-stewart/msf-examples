#! /bin/sh

# Pull the extra images that we need
docker pull polyverse/standalone:latest
docker pull polyverse/emcee:latest

# First run emcee as a straight-through http/https server
docker run -it --rm --name=wrapped-mc --privileged -e SA_BINDING_PORT=80 -e SA_NO_PULL=TRUE -v /var/run/docker.sock:/var/run/outer_docker.sock -v $PWD/appdef.js:/appdef.js -d -p 80:8080 polyverse/standalone:latest polyverse/emcee:latest -redirect=false

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

echo "Testing websocketecho over HTTP: "
curl --header "Connection: Upgrade" --header "Upgrade: websocket" --header "Host: localhost" --header "Origin: http://localhost/websocket" --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" --header "Sec-WebSocket-Version: 13" http://localhost/websocketecho

docker kill wrapped-mc > /dev/null 2>&1

echo ""
echo "Done"
