echo "Reading latest known published MSF."
msf=$(cat ../msf)
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

image=$1
if [[ "$image" == "" ]]; then
	echo "This script takes in a private image to which you already have pull access on this docker instance."
	echo "Since you haven't provided one, defaulting to a public hello world image."
	image="tutum/hello-world"
fi

echo "Running the Microservice firewall over privately available image: $image"
echo "This is done by mounting ~/.docker/config.json to /root/.docker/config.json in the MSF container,"
echo "allowing the inner daemon to pull that image."

docker run --rm -it --name polyverse_microservice_firewall -p 8080:8080 --privileged -v ~/.docker/config.json:/root/.docker/config.json "$msf" "$image"
