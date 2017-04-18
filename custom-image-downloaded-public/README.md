# Use a non-default, but public, Microservice image

This example Firewalls a publicly available Microservice (we use
`tutum/hello-world` for demo.)

## What it demonstrates

This example demonstrates that the Microservice Firewall can pull
the image provided as a parameter before protecting it.

However, this image must be publically downloadable without any
credentials required to pull.

## How it works

This example builds on the [Simple](../default) example, and adds
only one parameter which happens to be the name of the Microservice
Image which you want to protect/firewall.

The entrypoint merely runs a `docker pull $1` on the image
that you specify as a parameter. Nothing more happens.