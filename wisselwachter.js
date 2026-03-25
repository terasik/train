let cnt=0
let server_status=false;
let train_status="unknown";
let switch_status=[]
let xhttp = new XMLHttpRequest();
xhttp.timeout=2500;
xhttp.onerror=xhr_error
xhttp.ontimeout=xhr_timeout
load_state()

/*
let canv_element=document.getElementById('canvas');
let canv_width=canv_element.clientWidth
let canv_height=canv_element.clientHeight
let canv_context=vanv_element
*/

const swrad=2
const swpos=[
    [[0.58, 0.19], [0.54, 0.24]],
    [[0.80, 0.28], [0.87, 0.28]]
]

function get_canvas() {
    console.log("get canvas");
    let canv_element=document.getElementById('canvas');
    return canv_element.getContext('2d');
}

function reset_canvas() {
    console.log("reset switch positions");
    let context=get_canvas();
    context.clearRect(0, 0, 300, 150);
}

function draw_switch(sw_nr=0, sw_state=0) {
    console.log("draw switch position");
    let context=get_canvas();
    let ce=document.getElementById('canvas');
    //console.log(`context w/h x=${ce.width} y=${ce.height}`);
    let x=Math.round(swpos[sw_nr][sw_state][0]*ce.width)
    let y=Math.round(swpos[sw_nr][sw_state][1]*ce.height)
    console.log(`switch pos x=${x} y=${y}`);
    context.beginPath();
    context.arc(x, y, swrad, 0, 2*Math.PI);
    context.fillStyle = "green";
    context.fill();
    context.stroke();
    x=Math.round(swpos[sw_nr][sw_state^1][0]*ce.width)
    y=Math.round(swpos[sw_nr][sw_state^1][1]*ce.height)
    console.log(`switch pos x=${x} y=${y}`);
    context.beginPath();
    context.arc(x, y, swrad, 0, 2*Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.stroke();
}
    
    
    

function load_state() {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            j=JSON.parse(this.responseText);
            console.log("state responce: "+JSON.stringify(j));
            set_server_status(true);    
            set_train_status("ok");
            
            set_switch_status(j.switches);    
        }
        else if (this.readyState == 4 && this.status != 200) {
            try {
                j=JSON.parse(this.responseText);
                console.warn("state responce with http!=200");
                console.warn("state responce: "+JSON.stringify(j));
                set_server_status(true);    
                set_train_status("nok");
                set_switch_status([]);    
            }
            catch {
                console.warn("responce is no json.");
            }
        }    
    };
    xhttp.open("TSTATE", "", true);
    xhttp.send();
}

function interval_callback() {
    document.getElementById("cnt").innerText="counter: "+cnt;
    cnt++;
    load_state()
}

function set_server_status(s=false){
    console.log("setting server status");
    let e=document.getElementById("server_status");
    if (s) {
        e.style.backgroundColor="green";
        e.innerText="Server Status: OK";
    }
    else {
        e.style.backgroundColor="red";
        e.innerText="Server Status: NOK";
        set_train_status("unknown");
    }
    setTimeout(load_state, 500)
}


function set_train_status(s="unknown"){
    console.log("setting train status");
    let e=document.getElementById("train_status");
    if (s=="ok") {
        e.style.backgroundColor="green";
    }
    else {
        set_switch_status([]);
        e.style.backgroundColor="red";
    }
    e.innerText="Zug Status: "+s.toUpperCase();
    
}

function set_switch_status(sw_state=[]){
    console.log(sw_state);
    console.log(`set switches state to ${sw_state}`);
    let e=document.getElementById("switch_status");
    reset_canvas();
    if (sw_state.length>0) {
        e.style.backgroundColor="green";
        e.innerText="Weichen Status: "+sw_state.join('');
        for (let sw_nr=0; sw_nr<sw_state.length; sw_nr++) {
            draw_switch(sw_nr, sw_state[sw_nr]);
        }
    }
    else {
        e.style.backgroundColor="red";
        e.innerText="Weichen Status: NOK";
    }
    
}


function xhr_error() {
    console.error("no reaponce from server");
    set_server_status(false);
}

function xhr_timeout() {
    console.error("request timeout");
    set_server_status(false);
}

