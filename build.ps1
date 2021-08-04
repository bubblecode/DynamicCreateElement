Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue -ErrorVariable $removeDirError
if($removeDirError) {
  Write-Warning 'cannot delete folder ./dist'
}
mkdir dist
./node_modules/.bin/babel --out-dir ./dist ./src
Copy-Item src/api.js dist/api.js.flow
Copy-Item src/DynamicCreateElement.js dist/DynamicCreateElement.js.flow
Copy-Item src/DynamicCreateElement.css dist/DynamicCreateElement.css