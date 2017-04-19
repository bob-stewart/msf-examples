# Custom Configuration Settings

This is a fairly simple example that demonstrates setting custom
configuration options for Microservice Firewall to use.

## What it demonstrates

We are going to set a configuration key that will make Microservice
Firewall log at the debug level.

## How it works

* In this directory is a file called polyverse.yaml. It's contents are:

```
polyverse.config.monitoring.log_level: "debug"
```

* This file is mounted into the Microservice Firewall at special
location `/polyverse.yaml` which the entrypoint looks for and loads, \
if one exists.

* A whole host of configuration keys can be specified in this manner.
For more details on what configurations are available and what each
does, please contact the Polyverse Team.