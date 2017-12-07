git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple
echo "Upgrading using standard-version"
npm run release
if [ $? != 0 ]; then
  exit $?
fi
echo "Creating git branch"
PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
BRANCH="updateTo${PKG_VER_NEXT}"
git checkout -b $BRANCH

git status
git commit -m "Update test coverage and code scan files"
# this pull request through this branch will be needed to be reviewed as usual
git remote rm origin
git remote add origin $GITHUB_URL_SECURED
git push --follow-tags origin master
hub pull-request -b master -m "chore: Merging CHANGELOG and package.json changes"
