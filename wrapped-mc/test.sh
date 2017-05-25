#! /bin/sh

echo "**********************************************************************"
echo "Pull docker images that we'll be needing: ****************************"
echo "**********************************************************************"
docker pull polyverse/standalone:latest
docker pull polyverse/emcee:latest
echo "**********************************************************************"
echo ""
echo ""
echo "**********************************************************************"
echo "Starting wrapped polyverse/emcee with redirection disabled: **********"
echo "**********************************************************************"
docker run --rm --name=wrapped-mc -d -it --privileged -e SA_BINDING_PORT=80 -e SA_NO_PULL=TRUE -v /var/run/docker.sock:/var/run/outer_docker.sock -v $PWD/appdef.js:/appdef.js -p 80:8080 polyverse/standalone:latest polyverse/emcee:latest -redirect=false
echo "Done"
echo "**********************************************************************"
echo ""
echo ""
echo "**********************************************************************"
echo "Waiting for wrappeed polyverse/emcee to be healthy: ******************"
echo "**********************************************************************"
while [[ "$(docker inspect --format '{{ .State.Health.Status }}' wrapped-mc 2>/dev/null)" != "healthy" ]]; do
	sleep 5
done
echo "Ready"
echo "**********************************************************************"
echo ""
echo ""
echo "**********************************************************************"
echo "Testing HTTP: ********************************************************"
echo "**********************************************************************"
curl http://localhost
echo ""
echo "**********************************************************************"
echo ""
echo ""
echo "**********************************************************************"
echo "Testing websocket over HTTP: *****************************************"
echo "**********************************************************************"
curl --header "Connection: Upgrade" --header "Upgrade: websocket" --header "Host: localhost" --header "Origin: http://localhost/websocket" --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" --header "Sec-WebSocket-Version: 13" http://localhost/websocket
echo "**********************************************************************"
echo ""
echo ""
echo "**********************************************************************"
echo "Testing websocketecho over HTTP for 75 seconds: **********************"
echo "**********************************************************************"
curl --header "Connection: Upgrade" --header "Upgrade: websocket" --header "Host: localhost" --header "Origin: http://localhost/websocket" --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" --header "Sec-WebSocket-Version: 13" --no-buffer --max-time 75 http://localhost/websocketecho
echo "**********************************************************************"
echo ""
echo ""
echo "**********************************************************************"
echo "Killing wrapped polyverse/emcee: *************************************"
echo "**********************************************************************"
docker kill wrapped-mc > /dev/null 2>&1
echo "Done"
echo "**********************************************************************"
