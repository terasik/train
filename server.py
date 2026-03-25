#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import time

class MyHandler( SimpleHTTPRequestHandler):

    def do_TSTATE(self):
        #time.sleep(3) 
        try:
            st="0"
            with open("state.txt") as f:
                st=f.read().strip()
            sti=int(st)
        except:
            sti=0
        if sti:    
            resp = { "status": "ok", 
                   "error": False, 
                   "switches": [1,0]
                    }

            self.send_response(200)
        else:
            resp = { "status": "nok", 
                   "error": True, 
                   "switches": []
                    }

            self.send_response(500)
               
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response_message = bytes(json.dumps(resp), "utf-8")
        self.wfile.write(response_message)


#httpd = HTTPServer(('0.0.0.0', 8000), SimpleHTTPRequestHandler)
httpd = HTTPServer(('0.0.0.0', 8000), MyHandler)

httpd.serve_forever()
