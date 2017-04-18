# Load an image from a tarball

When running in scenarios where there is no internet connection
available, or you don't want the Microservice Firewall to ever
see your credentials (which is a very practice to follow), or
you have cached images, it makes sense to have tarballed images
passed to the Microservice firewall so it doesn't have to pull them
each time it runs.

This is a widely used scenario by Polyverse internally as well as
by a lot of users of the MSF.

## What it demonstrates

The purpose of this example is to demonstrate that the Microservice
Firewall can utilize images provided to it through a tarball.

## How it works

* The `test.sh` script first pulls our favorite demo image,
`tutum/hello-world` and then runs `docker save tutum/hello-world` to
save it in a tar file. It then calls gzip on the file to make a tar.gz
file.

* This file is mounted into the Microservice Firewall at special
location `/images.tar.gz` which the entrypoint looks for and loads
images from, if one exists. You can load any number of images into
the inner docker daemon using this method.

* The load is done by simply running `docker load /images.tar.gz` on
the inner daemon.