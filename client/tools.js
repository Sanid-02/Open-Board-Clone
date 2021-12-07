let option = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");

let pencil = document.querySelector(".pencil");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let pencilFlag = false;
let penWidth = document.querySelector(".pencilW");
let pW = penWidth.value;

let pC = "black";

let eraser = document.querySelector(".eraser");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let eraserFlag = false;
let eW = document.querySelector(".eraserW");

let rectangle = document.querySelector(".rectangle");
let line = document.querySelector(".line");

let colour = document.querySelector(".colour");
let colourCont = document.querySelector(".color-cont");
let colourFlag = false;

let upload = document.querySelector(".upload");

let notes = document.querySelector(".notes");

let drawingTool = "pencil";

option.addEventListener("click", function (e) {
  let elem = option.children[0];
  console.log(elem);
  let iconClass = elem.classList[1];
  if (iconClass == "fa-ellipsis-v") {
    elem.classList.remove("fa-ellipsis-v");
    elem.classList.add("fa-times");
    option.style.backgroundColor = "#EA2027";
    toolsCont.style.display = "flex";
  } else {
    elem.classList.remove("fa-times");
    elem.classList.add("fa-ellipsis-v");
    option.style.backgroundColor = "#2ecc71";
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
    colourCont.style.display = "none";
  }
});

pencil.addEventListener("click", function (e) {
  drawingTool = "pencil";
  pencilFlag = !pencilFlag;
  pC = pC == "white" ? "black" : pC;
  console.log(pC);
  pW = penWidth.value;
  if (pencilFlag) pencilToolCont.style.display = "block";
  else pencilToolCont.style.display = "none";
});

eraser.addEventListener("click", function (e) {
  eraserFlag = !eraserFlag;
  drawingTool = "eraser";
  pC = "white";
  pW = eW.value;
  if (eraserFlag) eraserToolCont.style.display = "flex";
  else eraserToolCont.style.display = "none";
});

eW.addEventListener("change", function () {
  pW = eW.value;
});

rectangle.addEventListener("click", function (e) {
  drawingTool = "rectangle";
  pC = colourCont.value;
  pW = penWidth.value;
  console.log(drawingTool);
});

line.addEventListener("click", function (e) {
  drawingTool = "line";
  pC = colourCont.value;
  pW = penWidth.value
  console.log(drawingTool);
});

colour.addEventListener("click", function (e) {
  colourFlag = !colourFlag;
  if (colourFlag) colourCont.style.display = "flex";
  else colourCont.style.display = "none";
  
  if(colourFlag){
    colourCont.addEventListener("click", function (e){
      // console.log(e.target.classList[0]);
      pC = e.target.classList[0];
    })
  }
});

notes.addEventListener("click", function (e) {
  let template = `
  <div class="header-cont">
  <div class="minimize">
      <i class="far fa-window-minimize" style="font-size: 0.8em; margin-top: -0.5em;"></i>
  </div>
  <div class="close">
      <i class="fas fa-times" style="font-size: 0.8em; margin-top: 0.3em"></i>
  </div>
</div>
<div class="note-cont">
  <textarea spellcheck = "false"></textarea>
</div>
  `;
  noteManager(template);
});

function dragAndDrop(ball, event) {
  let shiftX = event.clientX - ball.getBoundingClientRect().left;
  let shiftY = event.clientY - ball.getBoundingClientRect().top;

  ball.style.position = "absolute";
  ball.style.zIndex = 1000;
  // document.body.append(ball);

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    ball.style.left = pageX - shiftX + "px";
    ball.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  ball.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    ball.onmouseup = null;
  };
}

upload.addEventListener("click", function (e) {
  // Open File Explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", function (e) {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    let template = `
            <div class="header-cont">
            <div class="minimize">
                <i class="far fa-window-minimize" style="font-size: 0.8em; margin-top: -0.5em;"></i>
            </div>
            <div class="close">
                <i class="fas fa-times" style="font-size: 0.8em; margin-top: 0.3em"></i>
            </div>
        </div>
        <div class="note-cont">
        <img src="${url}"/>
        </div>
            `;
    noteManager(template);
  });
});

function noteManager(stickyTemplate) {
  let stickCont = document.createElement("div");
  stickCont.setAttribute("class", "sticky-cont");
  stickCont.innerHTML = stickyTemplate;
  document.body.appendChild(stickCont);

  stickCont.onmousedown = function (e) {
    dragAndDrop(stickCont, e);
  };

  stickCont.ondragstart = function () {
    return false;
  };

  let minimize = stickCont.querySelector(".minimize");
  let minState = false;
  minimize.addEventListener("click", function (e) {
    minState = !minState;
    let note = stickCont.querySelector(".note-cont");
    if (minState) note.style.display = "none";
    else note.style.display = "block";
  });

  let close = stickCont.querySelector(".close");
  close.addEventListener("click", function (e) {
    stickCont.remove();
  });
}

penWidth.addEventListener("click", function (e) {
  if (pencilFlag) {
    console.log(penWidth.value);
    pW = penWidth.value;
  }
});
