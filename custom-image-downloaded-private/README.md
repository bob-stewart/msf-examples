# Use a non-default, but private, Microservice image

This example shows the mechanics of using a non-public
microservice image.

## What it demonstrates

This example demonstrates that the Microservice Firewall can pull
an image that is not public, but requires credentials to access,
as might be the case with private registries or private repositories.

## How it works

This example builds on the
[Public Non Default image](../custom-image-downloaded-public) example,
and adds a "config.json" file mounted from your `~/.docker/config.json`
into `/root/.docker/config.json` (because inner daemon is running
as root.)

The inner daemon, just like in the public image example, simply executes
a `docker pull $1` on the inner image. Since the inner shell is running
as root, it picks up the config.json mounted under, from its
perspective, `~/.docker/config.json`.

Due to the risks involved with giving out example credentials, we
still use the publicly available `tutum/hello-world` image in the
script, but you can easily modify it to something private that your
credentials access.

### Caveat
An important point of note, once downloaded, your credentials are not
then perpetrated deeper into the swarm. This is intentional since
the Microservice Firewall is intended as a one-off single scenario
tool.

For contracted customers we do have a method to safely and securely
allow Polyverse to pull updated images or private images directly
on the workers in a scaled out swarm.

