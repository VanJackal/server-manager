#!/bin/python
import sys
from mcstatus import JavaServer

try:
    server = JavaServer.lookup(sys.argv[1])
    status = server.status()
    print(status.players.online)
except:
    print(0)
