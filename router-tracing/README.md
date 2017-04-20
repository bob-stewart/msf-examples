# Enable Router Tracing in the Microservice Firewall

This is a fairly advanced example. It helps to be familiar with
the example for [Custom Configuration](../custom-config).

## What it demonstrates

In this example we'll demonstrate how a request flows through the
Polyverse Router and trace it's flow through the Application
Definition.

## How it works

* In this directory is a file called `polyverse.yaml`. It's contents are:

```
polyverse.config.router.route_trace: "true"
```

* You'll notice that it is used to custom-configure a key.

* When this example runs, and you try to curl the endpoint, if you add
a special header called `X-Polyverse-Route-Trace: enabled`, and you
should see the flow of your request through Polyverse.
```
Archishmats-MacBook-Pro-2:~ archis$ curl -H "X-Polyverse-Route-Trace: enabled" http://localhost:8080

=======================================================================================
This is a special Polyverse mode. The router will not actually process your request.
=======================================================================================

-------------------------------------------------------------------------
The original Request we obtained was:
{"Method":"GET","URL":{"Scheme":"","Opaque":"","User":null,"Host":"","Path":"/","RawPath":"","ForceQuery":false,"RawQuery":"","Fragment":""},"Proto":"HTTP/1.1","ProtoMajor":1,"ProtoMinor":1,"Header":{"Accept":["*/*"],"User-Agent":["curl/7.51.0"],"X-Polyverse-Route-Trace":["enabled"]},"Body":{},"ContentLength":0,"TransferEncoding":null,"Host":"localhost:8080","Form":{},"PostForm":{},"MultipartForm":null,"Trailer":null,"RemoteAddr":"10.255.0.4:55674","RequestURI":"/","TLS":null}
-------------------------------------------------------------------------


-------------------------------------------------------------------------
Obtained a a PolyverseRID from the Header:
-------------------------------------------------------------------------


-------------------------------------------------------------------------
PolyverseRID was empty in the header. Created and assigned a new one: B7afNAfYqRgheXEbH9uwe2qp77X4o9KGHgJcicR6NdE=
-------------------------------------------------------------------------


-------------------------------------------------------------------------
App-Client RouteRequest called for this request.
-------------------------------------------------------------------------


-------------------------------------------------------------------------
Returning list of 1 apps
-------------------------------------------------------------------------


-------------------------------------------------------------------------
Currently there are 1 apps in our list.
-------------------------------------------------------------------------


-------------------------------------------------------------------------
This request is supported by app: default_appdef
-------------------------------------------------------------------------


-------------------------------------------------------------------------
Javascript App default_appdef Route() returned a valid Route Info for this request: {"RouteType":4,"ID":"default_route","Timeout":31536000000000000,"SSLSkipCertVerify":false,"URL":null,"ContainerChain":{"PerInstanceTimeout":300000000000,"DesiredInstances":2,"ConnectionDrainGracePeriod":180000000000,"Chain":[{"BaseImage":"polyverse-tools.jfrog.io/modsecurity:7d99f4dfe9683e27f207a81d1de73be255dd967f","LaunchGracePeriod":60000000000,"HealthCheckURLPath":"/health","Cmd":["/entrypoint.sh","-proxy-pass=http://next:8080","-SecRuleEngine=On"],"Env":[],"ExtraHosts":null,"BindingPort":8080,"Mounts":null,"URLScheme":""},{"BaseImage":"polyverse-demos.jfrog.io/pvdemo-go:latest","LaunchGracePeriod":300000000000,"HealthCheckURLPath":"/","Cmd":null,"Env":null,"ExtraHosts":null,"BindingPort":8080,"Mounts":null,"URLScheme":""}]}}
-------------------------------------------------------------------------


-------------------------------------------------------------------------
This request was routed by the supporting application to: {"RouteType":4,"ID":"default_route","Timeout":31536000000000000,"SSLSkipCertVerify":false,"URL":null,"ContainerChain":{"PerInstanceTimeout":300000000000,"DesiredInstances":2,"ConnectionDrainGracePeriod":180000000000,"Chain":[{"BaseImage":"polyverse-tools.jfrog.io/modsecurity:7d99f4dfe9683e27f207a81d1de73be255dd967f","LaunchGracePeriod":60000000000,"HealthCheckURLPath":"/health","Cmd":["/entrypoint.sh","-proxy-pass=http://next:8080","-SecRuleEngine=On"],"Env":[],"ExtraHosts":null,"BindingPort":8080,"Mounts":null,"URLScheme":""},{"BaseImage":"polyverse-demos.jfrog.io/pvdemo-go:latest","LaunchGracePeriod":300000000000,"HealthCheckURLPath":"/","Cmd":null,"Env":null,"ExtraHosts":null,"BindingPort":8080,"Mounts":null,"URLScheme":""}]}}
-------------------------------------------------------------------------


-------------------------------------------------------------------------
Renamed the Route ID with the app prefix: default_appdef__default_route
-------------------------------------------------------------------------


-------------------------------------------------------------------------
This Request obtained a valid Route Info: {"RouteType":4,"ID":"default_appdef__default_route","Timeout":31536000000000000,"SSLSkipCertVerify":false,"URL":null,"ContainerChain":{"PerInstanceTimeout":300000000000,"DesiredInstances":2,"ConnectionDrainGracePeriod":180000000000,"Chain":[{"BaseImage":"polyverse-tools.jfrog.io/modsecurity:7d99f4dfe9683e27f207a81d1de73be255dd967f","LaunchGracePeriod":60000000000,"HealthCheckURLPath":"/health","Cmd":["/entrypoint.sh","-proxy-pass=http://next:8080","-SecRuleEngine=On"],"Env":[],"ExtraHosts":null,"BindingPort":8080,"Mounts":null,"URLScheme":""},{"BaseImage":"polyverse-demos.jfrog.io/pvdemo-go:latest","LaunchGracePeriod":300000000000,"HealthCheckURLPath":"/","Cmd":null,"Env":null,"ExtraHosts":null,"BindingPort":8080,"Mounts":null,"URLScheme":""}]}}
-------------------------------------------------------------------------


-------------------------------------------------------------------------
This Route Info produced the route identifier: routeid:default_appdef__default_route,15a2f3b8cb2d7a13f352615768e2b39acdadb30b1f9842acb28014c202f70554
-------------------------------------------------------------------------


-------------------------------------------------------------------------
This Route Info has a registered handler. This is where the request would have gone to the chain.
-------------------------------------------------------------------------

Archishmats-MacBook-Pro-2:~ archis$
```