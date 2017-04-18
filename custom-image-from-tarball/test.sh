echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

echo "Downloading an example image: tutum/hello-world"
docker pull tutum/hello-world

echo "Saving it to a tar file"
docker save tutum/hello-world -o images.tar

echo "Gzipping the tarball"
gzip images.tar

echo "Running Microservice firewall with private images loaded from a tarball."

docker run --rm -it \
      --name polyverse_microservice_firewall \
      -p 8080:8080 \
      -p 8443:8443 \
      --privileged \
      -v $PWD/images.tar.gz:/images.tar.gz \
      $msf \
      tutum/hello-world
