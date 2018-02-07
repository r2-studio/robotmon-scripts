
CROP_WIDTH=48
RESIZE_WIDTH=16

for FILENAME in `ls origin_images_jp`
do
  echo "build/make_images origin_images_jp/$FILENAME $CROP_WIDTH $RESIZE_WIDTH"
  build/make_images origin_images_jp/$FILENAME $CROP_WIDTH $RESIZE_WIDTH
done

OUTPUT=tsums_jp_$RESIZE_WIDTH

mkdir $OUTPUT

mv origin_images_jp/*_s_*.png $OUTPUT
