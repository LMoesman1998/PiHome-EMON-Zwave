#!/bin/bash

sftp pi@pihome.local:/home/pi << EOF1
put dist/pihome-zwave.zip
bye
EOF1
ssh pi@pihome.local << EOF2
rm -rf pihome-zwave
mkdir pihome-zwave
unzip pihome-zwave.zip -d pihome-zwave
cd pihome-zwave
yarn
EOF2