echo "Reading latest known published tag."
tag=$(cat ../tag)
echo "Using tag: $tag"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull store/polyverse/microservicefirewall:$tag

echo "Running the bare-simple Microservice firewall mode"
docker run --rm -it --name polyverse_microservice_firewall -p 8080:8080 --privileged store/polyverse/microservicefirewall:$tag
