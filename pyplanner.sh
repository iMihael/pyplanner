#!/bin/bash

case "$1" in
"start") 
./manage.py runfcgi host=127.0.0.1 port=8090 pidfile=/tmp/pyplanner.pid 
;;
"stop") 
kill -9 `cat /tmp/pyplanner.pid` 
;;
"restart")
$0 stop
sleep 1
$0 start
;;
*) echo "Usage: ./pyplanner.sh {start|stop|restart}";;
esac
