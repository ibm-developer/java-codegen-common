echo "Creating ../docs/cc/unit"
mkdir -p ../docs/cc/unit
echo "Running unit test coverage"
npm run coverage
echo "Copying ./coverage to ../docs/cc/unit"
cp -r ./coverage/* ../docs/cc/unit
ls -l ../docs/cc/unit
