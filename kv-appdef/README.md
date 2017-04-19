# Using late-bound Values in AppDef

This is a fairly advanced example. It helps to be familiar with
the example for [Custom Application Definition](../custom-appdef)
and the example for [Custom Configuration](../custom-config).

It demonstrates the power of Polyverse application definitions to
externalize certain values which you can bind at runtime.

This is very useful when you may want to have a swappable image, or
change number of instances or change the timeouts.

In fact that is exactly what the
[Default Microservice Firewall](../default) example uses to bind your
provided images to an Application Definition, so we don't have to
generate code on the fly.

## What it demonstrates

The purpose of this example is to demonstrate how to use a custom
application definition combined with a custom configuration to
produce a late-binded Microservice Firewall.

## How it works

* In this directory is a file called appdef.js. It's contents are:

```
app = function() {

    var defaultRouteInfoProducer = function(baseImage) {
       return  {
        RouteType:          4,
        ID:                 "dynamic_image_name",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         5 * 1000000000,
            DesiredInstances:           5,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          baseImage,
                    HealthCheckURLPath: "/",
                    LaunchGracePeriod:  10 * 1000000000,
                    BindingPort:        8080,
                }
            ]
        }
      };
    };

    return {
        Name: function(c) {
            return "SslDemo";
        },
        IsRequestSupported: function(r, c) {
            return true;
        },
        Route: function(r, c) {
		//Base image isn't known at the time of app-def writing/testing. It is
                //Bound at runtime from the configuration yaml file
                return defaultRouteInfoProducer(c.Kv.Get("base_image"));
        }
    };
}();
```

* Of important note in this file, is the line:
`return defaultRouteInfoProducer(c.Kv.Get("base_image"));`

* You'll notice that the Application Definition is provided with a
"context" object as the second parameter. This object provides access
to features such as logging, and the ability to read from the KV store.

* In the same directory is a file called `polyverse.yaml` whose
contents are:
```
kv.base_image: "polyverse-demos.jfrog.io/pvdemo-go:latest"
```

* Basically what this means is, by specifying a generic AppDef,
and then filling in values from the KV store at runtime, we are able
to produce some very powerful applications.