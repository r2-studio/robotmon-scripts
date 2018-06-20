OUTPUT="../framework.js"

echo "// Robotmon Framework" > $OUTPUT

for filename in ./*.js;
do
    echo "Build" $filename;
    echo "\n" >> $OUTPUT;
    cat $filename >> $OUTPUT;
done

# Check code
node $OUTPUT;