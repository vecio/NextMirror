#!/bin/sh

ffmpeg -s 2880x1800 -r 30 -f x11grab -i :0.0+0,0 -c:v libx264 -preset fast -profile:v baseline -tune zerolatency -pix_fmt yuv420p -s 640x368 -bf 0 -flags -global_header -f h264 'http://127.0.0.1:8080/?w=640&h=368'
