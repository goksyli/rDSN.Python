import sys
import os
import time
import threading

import MonitorApp 
from dev.python.ServiceApp import *
THREAD_POOL_DEFAULT = ThreadPoolCode.threadpool_code_register('THREAD_POOL_DEFAULT')


class MonitorService(ServiceApp):
    __server = None
    __echo_client = None
    __task = None

    def start(self, argv):
        
        _server_thread= threading.Thread(target=MonitorApp.start_http_server,args=(argv[1],))
        _server_thread.start()
        return 0

    def stop(self, cleanup = 0):
        #_server_thread.stop()
        #_server_thread.join()
        pass


