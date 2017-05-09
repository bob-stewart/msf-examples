#!/bin/bash

echo "Checking credentials to jFrog repository..."
JFROG_AUTH=$(cat  ~/.docker/config.json | jq -rM '.auths."polyverse-store.jfrog.io".auth')
if [[ "$JFROG_AUTH" == "" ]]; then
        echo "You need to run 'docker login polyvserse-store.jfrog.io'. Please contact Polyverse if you need access to our jFrog repo. Exiting..."
        exit 1
else
        echo "--> polyverse-store.jfrog.io... ok."
fi

str="polyverse/emcee:latest"
images=( $str )

echo "Making sure we have the images we need..."
for image in "${images[@]}"
do
	printf -- "--> %s... " $image

	image_id=$(docker images -q $image)
	if [[ "$image_id" != "" ]]; then
		printf -- "found image id: %s\n" $image_id
	else
		printf -- "not found. Please build the image $image. Exiting...\n"
		exit 1
	fi
done

echo "Creating images.tar..."
docker save $str -o images.tar
if [[ $? != 0 ]]; then
  echo "Error occurred on docker save. Exiting..."
  exit 1
else
  echo "--> Successfully created images.tar."
fi

echo "Compressing the images tarball. This too, will take a few minutes. Please be patient."
gzip ./images.tar

echo "Building container \"wrapped-mc:latest\"..."
docker build --no-cache -t wrapped-mc .
if [[ $? -ne 0 ]]; then
  echo "--> Encountered error building container image. Exiting..."
  exit 1
else
  echo "--> Successfully built container image."
fi

echo "Removing temporary files...."
rm ./images.tar.gz

echo "Finished."
