echo "Reading latest known published tag."
tag=$(cat ../tag)
echo "Using tag: $tag"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull store/polyverse/microservicefirewall:$tag

image=$1
if [[ "$image" == "" ]]; then
	image="tutum/hello-world"
fi

echo "Running the Microservice firewall over publically available image: $image"
docker run --rm -it --name polyverse_microservice_firewall -p 8080:8080 --privileged store/polyverse/microservicefirewall:$tag "$image"
