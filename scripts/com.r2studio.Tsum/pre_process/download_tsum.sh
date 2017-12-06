CROP_WIDTH=48
RESIZE_WIDTH=16

#EN
echo adb shell "su -c 'rm -rf /sdcard/block'"
adb shell "su -c 'rm -rf /sdcard/block'"

echo adb shell "su -c 'cp -r /data/data/com.linecorp.LGTMTMG/files/gameres/block /sdcard/'"
adb shell "su -c 'cp -r /data/data/com.linecorp.LGTMTMG/files/gameres/block /sdcard/'"

echo adb pull /sdcard/block .
adb pull /sdcard/block .

mkdir origin_images
mv block/block_*_s.png origin_images
rm origin_images/block_event_*_s.png

for FILENAME in `ls origin_images`
do
  echo build/make_images origin_images/$FILENAME $CROP_WIDTH $RESIZE_WIDTH 
  build/make_images origin_images/$FILENAME $CROP_WIDTH $RESIZE_WIDTH
done

OUTPUT=tsums_$RESIZE_WIDTH
mkdir $OUTPUT
mv origin_images/*_s_*.png $OUTPUT
cp tsums_ttung/* $OUTPUT

rm -r ../$OUTPUT
rm -r block
mv $OUTPUT ..

#JP
echo adb shell "su -c 'rm -rf /sdcard/block'"
adb shell "su -c 'rm -rf /sdcard/block'"

echo adb shell "su -c 'cp -r /data/data/com.linecorp.LGTMTM/files/gameres/block /sdcard/'"
adb shell "su -c 'cp -r /data/data/com.linecorp.LGTMTM/files/gameres/block /sdcard/'"

echo adb pull /sdcard/block .
adb pull /sdcard/block .

mkdir origin_images_jp
mv block/block_*_s.png origin_images_jp
rm origin_images_jp/block_event_*_s.png

for FILENAME in `ls origin_images_jp`
do
  echo build/make_images origin_images_jp/$FILENAME $CROP_WIDTH $RESIZE_WIDTH 
  build/make_images origin_images_jp/$FILENAME $CROP_WIDTH $RESIZE_WIDTH
done

OUTPUT=tsums_jp_$RESIZE_WIDTH
mkdir $OUTPUT
mv origin_images_jp/*_s_*.png $OUTPUT
cp tsums_ttung/* $OUTPUT

# print
echo "EN"
ls origin_images | xargs -I{} basename {} .png | awk 'BEGIN{str=""}{str=str"\""$0"\""", "}END{print str}'
echo "JP"
ls origin_images_jp | xargs -I{} basename {} .png | awk 'BEGIN{str=""}{str=str"\""$0"\""", "}END{print str}'

rm -r ../$OUTPUT
mv $OUTPUT ..
rm -r block
rm -r origin_images
rm -r origin_images_jp
