mkdir dist
./node_modules/.bin/babel --out-dir ./dist ./src

@REM copy src/api.js dist/api.js.flow
@REM copy src/DynamicCreateElement.js dist/DynamicCreateElement.js.flow
@REM copy src/DynamicCreateElement.css dist/DynamicCreateElement.css