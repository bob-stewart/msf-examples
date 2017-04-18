# Microservice Firewall examples

This repository contains examples on the various things you can do with the Microservice Firewall, which is available on the docker store: [https://store.docker.com/images/microservice-firewall?tab=description](https://store.docker.com/images/microservice-firewall?tab=description)

# How to run

## Login to Docker

Make sure you are logged into the Docker Store by creating a Docker ID, and then on your command prompt, running "docker login". Enter your username and password.

## Run ./test.sh under any scenario directory

In nearly all cases, you should be able to clone this repo, and then go into a scenario directory (for example, you'd go into "ssl" to see how Polyverse can SSL-wrap your service and handle redirections), and then run "./test.sh".

Everything you need to run that scenario should be in that directory.

## (Version override)

Since the tag in Docker Store updates slower than Microservice builds we publish to our contracted customers, these examples may not necessarily work with the image published on the store. Some examples are meant for not-yet-released versions.

If you have access to our private images, then you can easily override the MSF version used by the scripts by specifing the 'msf' variable in your shell.

For example:
```
export msf="polyverse/microservicefirewall:v1.0.1"
```

When this variable is reset, the version is picked up from the file "msf" at the repo root. When we publish new versions and they are approved by the Docker Store, we update this file with the latest tag. That allows us to update ALL examples at once.
