# cycler-tutum-hello-world

This is a pretty simple use of Polyverse Container Cycler. The
public tutum/hello-world container is cycled.

Additionally, there is a custom appdef.js that's mounted with
the only change being 3 (instead of 2) desired instances rotating
every 5 seconds (instead of 5 minutes).

## What it demonstrates

Because the tutum/hello-world displays the container id, it's
a simple way to demonstrate that containers are cycling by
refreshing the page in a browser.

If you expose the API (which is listening on port 9000), then
you can use the `polyverse-demos.jfrog.io/cycle-demo` app to
watch the containers move through the lifecycle states.

## How it works

Nothing special outside of mounting appdef.js. It would be nice
to be able to pass things like DesiredInstances and
PerInstanceTimeout via environment variables so that a common
appdef.js can be used.
