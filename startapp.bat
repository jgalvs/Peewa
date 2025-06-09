TIMEOUT 3
C:
cd C:\Users\juliu\Documents\Projects\Peewa
pm2 start .\src\index.js --name Peewa --watch . --ignore-watch="node_modules"

cmd /k