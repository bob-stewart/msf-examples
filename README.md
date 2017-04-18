# Microservice Firewall examples

This repository contains examples on the various things you can do with
the [Microservice Firewall](https://store.docker.com/images/microservice-firewall?tab=description),
which is available on the docker store for download.

## How to run examples

### Login to Docker

Make sure you are logged in to Docker ID from your local daemon. If you
don't have a Docker ID, you can easily create one on the
[Docker Store](https://store.docker.com/).

Once you have an ID, you can login to your docker daemon by running
 `docker login`.

For example:
```
Archishmats-MacBook-Pro-2:~ archis$ docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username (archisgore): archisgore
Password:
Login Succeeded
```

### Run ./test.sh under any scenario directory

In nearly all cases, you should be able to clone this repo, and then go
into a scenario directory (for example, you'd go into "ssl" to see how
Polyverse can SSL-wrap your service and handle redirections), and then
run `./test.sh`.

Everything you need to run that scenario should be in that directory.

## Additional Tricks/Hacks/Tips

## Open a shell into the Microservice Firewall and poke around

The Microservice Firewall is a deceptive name. It is ALL of Polyverse
technology captured within a single Docker-in-Docker container
that creates a full swarm internally. That exact same configuration
would run on a scaled out large scale swarm identically with no
changes whatsoever.

To explore how polyverse works, or debug failures, see how we log,
see how things function under load, etc. you ca execute:

```
docker exec -it polyverse_microservice_firewall bash
```

Here's what it looks like in a running example:

```
Archishmats-MacBook-Pro-2:~ archis$ docker ps -a
CONTAINER ID        IMAGE                                                                     COMMAND                  CREATED             STATUS              PORTS                              NAMES
8d57b8857754        polyverse/microservicefirewall:9d4a9b5c9ceec87994549bc191d4be7d93ce1c50   "/sbin/tini -g -- ..."   3 minutes ago       Up 2 minutes        2375/tcp, 0.0.0.0:8080->8080/tcp   polyverse_microservice_firewall
Archishmats-MacBook-Pro-2:~ archis$ docker exec -it polyverse_microservice_firewall bash

bash-4.3# docker ps -a
CONTAINER ID        IMAGE                                                                                   COMMAND                  CREATED              STATUS              PORTS               NAMES
a7ce193c3773        polyverse-runtime.jfrog.io/container-manager:b5f3b793aa0dc30eca42354f7aaeeef37612c60f   "/init.sh -statsd_..."   About a minute ago   Up About a minute                       polyverse_container_manager.1.bmpywsat3bp99dscdhqmiylg8
385902455f27        polyverse-runtime.jfrog.io/router:afea452f352d47f2dcc0a3d206efd6ffd9407621              "/init.sh -apiInte..."   About a minute ago   Up About a minute                       polyverse_router.1.vvpumw60q1wez40cybi6exvaq
2711b4f0846f        nsqio/nsq:v0.3.8                                                                        "/nsqd -http-addre..."   About a minute ago   Up About a minute                       polyverse_nsq_1.1.1wwvjom6h1xt18n2ddae871a4
116de199169c        quay.io/coreos/etcd:v3.1.5                                                              "/usr/local/bin/et..."   About a minute ago   Up About a minute                       polyverse_etcd_1.1.5fcpio76auhuomxe80mvkm6or
481ecfed411b        polyverse-runtime.jfrog.io/supervisor:138a719f033f95523d18268002b83bb33630eb26          "/init.sh -config-..."   2 minutes ago        Up 2 minutes                            polyverse_supervisor.1.sdlaqsl5bdopbqqdvfzar3zxd

bash-4.3# docker service ls
ID                  NAME                          MODE                REPLICAS            IMAGE
bootcfo62rkg        polyverse_etcd_1              replicated          1/1                 quay.io/coreos/etcd:v3.1.5
l4op7ttwbzbi        polyverse_router              replicated          1/1                 polyverse-runtime.jfrog.io/router:afea452f352d47f2dcc0a3d206efd6ffd9407621
mmhxdyih4sk4        polyverse_nsq_1               replicated          1/1                 nsqio/nsq:v0.3.8
o5bfuu8r63nh        polyverse_supervisor          replicated          1/1                 polyverse-runtime.jfrog.io/supervisor:138a719f033f95523d18268002b83bb33630eb26
vbwfwow4tpr0        polyverse_container_manager   replicated          1/1                 polyverse-runtime.jfrog.io/container-manager:b5f3b793aa0dc30eca42354f7aaeeef37612c60f
bash-4.3#
```

## Override version of Microservice Firewall that the examples use

Since the tag in Docker Store updates slower than Microservice builds
we publish to our contracted customers, these examples may not
necessarily work with the image published on the store. Some examples
are meant for not-yet-released versions. Sometimes for contracted
customers, we may release patched releases or special functionality
that does not apply generally.

If you have access to our private images, then you can easily override
the MSF version used by the scripts by specifing the 'msf' variable in
your shell.

For example:
```
export msf="polyverse/microservicefirewall:v1.0.1"
```

When this variable is reset, the version is picked up from the file
"msf" at the repo root. When we publish new versions and they are
approved by the Docker Store, we update this file with the latest tag.
That allows us to update ALL examples at once.
