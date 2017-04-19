# Custom Application Definition

This is a fairly advanced example. Polyverse uses an "Application
Definition" which is a small Javascript program that tells Polyverse
how your application should behave/act.

This example demonstrates how you make the Microservice Firewall use a
custom application definition file.

## What it demonstrates

The purpose of this example is to demonstrate how to use a custom
application definition with Microservice Firewall.

Incidentally this example also demonstrates being able to specify
multiple images to pull inside MSF using a file called images.json.

## How it works

* In this directory is a file called appdef.js. It's contents are:

```
app = function() {

    var defaultRouteInfo = {
        RouteType:          4,
        ID:                 "custom_route_info",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         5 * 1000000000,
            DesiredInstances:           5,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          "tutum/hello-world:latest",
                    HealthCheckURLPath: "/",
                    LaunchGracePeriod:  10 * 1000000000,
                    BindingPort:        80,
                }
            ]
        }
    };

    return {
        Name: function(c) {
            return "SslDemo";
        },
        IsRequestSupported: function(r, c) {
            return true;
        },
        Route: function(r, c) {
                return defaultRouteInfo;
        }
    };
}();
```

* This file is mounted into the Microservice Firewall at special
location `/appdef.js` which the entrypoint looks for and loads, \
if one exists.

* When a custom appdef.js is provided, the MSF does not know what images
it needs to pre-cache (if you notice, the AppDef is a Javascript file
so it has the power to compose image names dynamically.)

* To ensure we cache our image, we also provide a file called
images.json that is mounted at `/images.json` from where the images
are pulled.