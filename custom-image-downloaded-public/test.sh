echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
	msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

image=$1
if [[ "$image" == "" ]]; then
	image="tutum/hello-world"
fi

echo "Running the Microservice firewall over publically available image: $image"
docker run --rm -it --name polyverse_microservice_firewall -p 8080:8080 --privileged "$msf" "$image"
