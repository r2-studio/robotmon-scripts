
CROP_WIDTH=48
RESIZE_WIDTH=16

for FILENAME in `ls origin_images`
do
  build/make_images origin_images/$FILENAME $CROP_WIDTH $RESIZE_WIDTH
done

OUTPUT=tsums_$RESIZE_WIDTH

mkdir $OUTPUT

mv origin_images/*_s_*.png $OUTPUT
