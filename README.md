# Microservice Firewall examples

This repository contains examples on the various things you can do with
the [Microservice Firewall](https://store.docker.com/images/microservice-firewall?tab=description),
which is available on the docker store for download.

# Table of contents

1. [How to run examples](#how-to-run-examples)
    1. [Login to Docker](#login-to-docker)
    2. [Run ./test.sh under any scenario directory](#run-testsh-under-any-scenario-directory)
    3. [Running examples securely](#running-examples-securely)
2. [Additional Tricks/Hacks/Tips](#additional-trickshackstips)
    1. [Open a shell into the Microservice Firewall and poke around](#open-a-shell-into-the-microservice-firewall-and-poke-around)
    2. [Override version of Microservice Firewall that the examples use](#override-version-of-microservice-firewall-that-the-examples-use)

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

**DISCLAIMER: THE DEFAULT TEST SCRIPT WILL LAUNCH A PRIVILEGED
CONTAINER. Plese see the next section
[Running examples securely](#running-examples-securely) to learn how
to launch examples without the --privileged flag.**

In nearly all cases, you should be able to clone this repo, and then go
into a scenario directory (for example, you'd go into "ssl" to see how
Polyverse can SSL-wrap your service and handle redirections), and then
run `./test.sh`.

Everything you need to run that scenario should be in that directory.

### Running examples Securely

With great security, comes just a tad bit more responsibility. This
section will inform you how to run Polyverse on your swarm without
requiring the `--privileged` flag used in the examples. It will
explain why we added it in the first place. We welcome better methods
on packaging.

#### TL;DR: how do I run it?

In order to run Microservice Firewall on a Docker Swarm, all you need to
do is, under any examples directory, edit the script `test.sh` and
replace the `--privileged` flag with either of the following:
 * `-v /var/lib/docker.sock:/var/lib/docker.sock` if you are running
 a Docker daemon locally and have it initialized in Swarm Mode (by
 running `docker swarm init`)

 * `-e "DOCKER_HOST=<swarmhost:swarmport>" ...` You would basically
 specify the exact same environment variables to the MSF container as
 you would if you were connecting to the swarm from the CLI.

This will make the Microservice Firewall connect to that external and
non-privileged endpoint and copy all its container images on there
using `docker load` and inject any configuration files using secrets,
and launch the supervisor.

#### What responsibilities does this bring?

Launching Polyverse in this mode brings with it some responsibilities
that you, as a user, must undertake.

* The major responsibility is that of ensuring the proper environment
exists for MSF to run on. Will have to launch the Docker Engine in
Swarm Mode, provide proper credentials to the MSF container to connect
to it, and debug any connection problems (if you give a DOCKER_HOST
environment variable for instance, you'll have to make sure it is
reachable and routable from the inner Docker CLI.)

* When you want to shut down Polyverse, you may find a proliferatio of
services and containers. This is, afterall, our speciality. We launch
and manage dozens of instances of your Microservice. So you will
need to shut them all down properly. If you are running no other
services on the same swarm, this should be as simple as running:
`docker service rm $(docker service ls -q)` on your command prompt.


#### Why do we pack as Docker-in-Docker?

Polyverse is designed to run on a swarm that is configured in a certain
way with parameters passed to Polyverse's Supervisor (who is
responsible for launching the entire system and managing it.)

This isn't complicated, but a bit difficult to explain at first sight.
In order to get past the initial hurdle (and also for internal testing),
we launch Polyverse using a "Docker-in-Docker" method. Inside the
Microservice Firewall, we launch a full Docker Daemon, initialize a
swarm on it, and set up files/mounts just the way we like them.

It also ensures we get to run in a swarm of a specific version with
parameters and APIs we've tested.

This allows us to pack and ship a complete and ideal environment for
us to demonstrate our canonical way of running Polyverse.

Finally, this is also how we can rapidly test Polyverse under specific
conditions.

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
