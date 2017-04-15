TAG=8e1c606825fd7f470053c7389d28c9879e5155c6-no-swizzle

docker service rm $(docker service ls -q)
sleep 5

docker secret rm config.json
docker secret create config.json ~/.docker/config.json
docker secret create ssl.key $PWD/ssl.key
docker secret create ssl.crt $PWD/ssl.crt

docker service create \
  --name=polyverse_supervisor \
  --restart-condition any \
  --mount "type=bind,source=$PWD/polyverse.yaml,destination=/polyverse.yaml" \
  --mount "type=bind,source=/var/run/docker.sock,destination=/var/run/docker.sock" \
  --network polyverse_nw \
  --with-registry-auth \
  --secret config.json \
  --env "DOCKER_CONFIG=/run/secrets" \
  polyverse-runtime.jfrog.io/supervisor:$TAG \
  -config-yaml-file=/polyverse.yaml \
  -restart false
 
