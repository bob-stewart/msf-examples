# Launching Microservice Firewall with logspout

This launches Microservice Firewall along with gliderlab's logspout
service which, among many things, provides consolidated container
log output via http endpoint.

## What it demonstrates

If you don't send logs to a centralized logging system like the ELK stack
then you can use the `docker logs` command. However, you'll need to do
this for a specific container and can't view logs in a consolidated
manner. By using this logspout mode, you can still use `docker logs`
but you can also `curl http://localhost:8888/logs` and view a consolidated
stream of all the containers. This is particularly useful if you want
to view the logs of transient containers.

## How it works

It is the simplest usage of Microservice Firewall with the additional
command-line arguments of `-e LOGSPOUT_PORT:8888 -p 8888:8888` which
pulls and launches the `gliderlabs/logspout` container image.

You can learn more about logspout here:
https://hub.docker.com/r/gliderlabs/logspout/
