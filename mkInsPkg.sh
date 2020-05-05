#!/bin/bash

echo "Packaging serviceMonitor server..."
fFlush=1
subdirs=("bin" "config" "models" "public" "routes" "services" "utilities" "scripts" "vendors")
# subdirs=("config" "models" "routes" "utils")
files=("*.sh" "app.js" "index.js" "package.json")

# use customized path as source, if any
if [ $# -eq 0 ]
then
    PKG="serviceMonitorSvr.zip"
    echo "Use default package filename $PKG"
else
    PKG=$1
    if [ $# -eq 2 ]
    then
        fFlush=$2
    else
        fFlush=0
    fi
fi

# remove existing zip file, if any
if [ -f $PKG ]
then
    if [ $fFlush = 1 ] 
    then
        echo "Remove old package $PKG."
        rm -f $PKG
        echo "Create package file $PKG."
    else
        echo "Create/update package file $PKG."
    fi
else
    echo "Create package file $PKG."
fi

# generate the zip file of modules
for i in "${subdirs[@]}"
do
   echo "Packaging sub-folder $i..." 
   zip -ry9 $PKG $i/*
done

for i in "${files[@]}"
do
   echo "Packaging $i..." 
   zip -y9 $PKG $i
done
scp serviceMonitorSvr.zip lfg:~/serviceMonitor
echo "serviceMonitor Server $PKG is ready for installation."
