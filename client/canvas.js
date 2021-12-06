let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let clear = document.querySelector(".clear");

let tool = canvas.getContext("2d");

// for Undo/Redo functionality
let undoRedoTrack = [];
let url = canvas.toDataURL();
undoRedoTrack.push(url);
let idx = 0;


  // mousedown -> start new path, mousedrag -> fill path(graphics)
  let mouseDown = false;
  let iX, iY, fX, fY;
  console.log(drawingTool);
  canvas.addEventListener("mousedown", function (e) {
    mouseDown = true;
    // tracePath({
    //   x: e.clientX,
    //   y: e.clientY,
    // });
    iX = e.clientX;
    iY = e.clientY;
    let data = {
      x: e.clientX,
      y: e.clientY,
    };
    socket.emit("tracePath", data);
  });

  canvas.addEventListener("mousemove", function (e) {
    if (mouseDown && (drawingTool == 'pencil' || pC == 'white' )) {
      let data = {
        x: e.clientX,
        y: e.clientY,
        pW: pW,
        pC: pC,
        tool:drawingTool,
      };
      // fillPath({
        //   x: e.clientX,
        //   y: e.clientY,
        // });
        socket.emit("fillPath", data);
      }
  });

  canvas.addEventListener("mouseup", function (e) {
    mouseDown = false;
    if(drawingTool == 'line' || drawingTool == 'rectangle'){
      let data = {
        x: e.clientX,
        y: e.clientY,
        pW: pW,
        pC: pC,
        tool:drawingTool,
      };
        socket.emit("fillPath", data);
    }
    else{
      let url = canvas.toDataURL();
      undoRedoTrack.push(url);
      idx = undoRedoTrack.length - 1;
    }
  });

undo.addEventListener("click", function (e) {
  console.log("Undo");
  if (idx > 0) {
    idx--;
    let data = {
      idxValue: idx,
      undoRedoTrack: undoRedoTrack,
    };
    socket.emit("undoRedo", data);
    // undoRedoCanvas(obj);
  }
});

redo.addEventListener("click", function (e) {
  console.log("Redo");
  if (idx < undoRedoTrack.length - 1) {
    idx++;
  }
  let data = {
    idxValue: idx,
    undoRedoTrack: undoRedoTrack,
  };
  // undoRedoCanvas(obj);
  socket.emit("undoRedo", data);
});

function undoRedoCanvas(obj) {
  idx = obj.idxValue;
  undoRedoTrack = obj.undoRedoTrack;

  tool.clearRect(0, 0, window.innerWidth, window.innerHeight);
  let url = undoRedoTrack[idx];
  let img = new Image();
  console.log(url);
  img.onload = function () {
    tool.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
  };
  img.src = url;
}

function tracePath(Obj) {
  tool.beginPath();
  tool.moveTo(Obj.x, Obj.y);
}

function fillPath(Obj) {
  tool.lineWidth = Obj.pW;
  tool.strokeStyle = Obj.pC;
  if(Obj.tool == 'pencil' || Obj.pC == 'white') {
    tool.lineTo(Obj.x, Obj.y);
    tool.stroke();
  }
  else{
    if(Obj.tool == 'rectangle'){
      let width = Obj.x - iX;
      let height = Obj.y - iY;
      tool.rect(iX, iY, width, height);
      tool.stroke();
      setTimeout(function(){
        redo.click();
      }, 100)
    }
    else if(Obj.tool == 'line'){
      tool.lineTo(Obj.x, Obj.y);
      tool.stroke();
    }

      let url = canvas.toDataURL();
      undoRedoTrack.push(url);
      idx = undoRedoTrack.length - 1;
    
  }
}

download.addEventListener("click", function (e) {
  let url = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

clear.addEventListener("click", function () {
  tool.clearRect(0, 0, window.innerWidth, window.innerHeight);
  let url = canvas.toDataURL();
  undoRedoTrack.push(url);
  idx = undoRedoTrack.length - 1;
  let data = {
    idxValue: idx,
    undoRedoTrack: undoRedoTrack,
  };
  socket.emit("undoRedo", data);
});

// Performing functionality on data received from server:
socket.on("tracePath", (data) => {
  //data-> from server
  tracePath(data);
});

socket.on("fillPath", (data) => {
  fillPath(data);
});

socket.on("undoRedo", (data) => {
  undoRedoCanvas(data);
});
