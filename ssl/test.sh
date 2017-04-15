echo "Reading latest known published MSF."
msf=$(cat ../msf)
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

echo "Running Microservice firewall to expose the image $image behind SSL."
echo "This demonstrates the power of a downloading from images.json, a custom configuration, and a custom Application Definition that routes intelligently"

docker run --rm -it \
      --name polyverse_microservice_firewall \
      -p 8080:8080 \
      --privileged \
      -v $PWD/ssk.key:/secrets/ssl.key \
      -v $PWD/ssl.crt:/secrets/ssl.crt \
      -v $PWD/polyverse.yaml:/polyverse.yaml \
      -v $PWD/appdef.js:/appdef.ks \
      -v $PWD/images.json:/images.json \
      $msf
