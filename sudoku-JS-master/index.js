// Load board game

import { easy, medium, hard, easy1, medium1, hard1 } from "./matrix.js";

// Tạo các biến
var timer; // Thời gian
var timeRemaining; // Thời gian còn lại
var lives; // Số mạng
var selectedNum; // Số trong ô
var selectedTile; // Số trong cột bên phải
var disableSelect; // Hủy bỏ chọn
let flag = 0; // Kiểm tra kích thước bàn sudoku
let flagTime = false;
var ar, result, rand, newResult;
let timeText;
window.onload = function () {
  // Bắt đầu khi bấm nút start
  id("start-btn").addEventListener("click", startGame);

  // Thêm sự kiện cho mỗi sớ cột bên phải
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      if (!disableSelect) {
        // Nếu số đã được chọn từ trước
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          // bỏ chọn tất cả các số
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }

          // Chọn số và cập nhật biến
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }

  id("pause").addEventListener("click", pauseGame);

  id("clear-btn").addEventListener("click", function () {
    selectedTile.textContent = "";
  });
};

function pauseGame() {
  if (flagTime == false) {
    // Dừng thời gian và không cho di chuyển
    disableSelect = true;
    clearTimeout(timer);
    flagTime = true;
    id("pause").textContent = "Chơi tiếp";
  } else {
    disableSelect = false;
    timer = setInterval(function () {
      timeRemaining--;
      if (timeRemaining === 0) endGame();
      id("timer").textContent = timeConversion(timeRemaining);
    }, 1000);
    flagTime = false;
    id("pause").textContent = "Dừng";
  }
}

function startGame() {
  let board;
  ar = null;
  result = null;
  rand = Math.floor(Math.random() * 2); // Tạo số rand
  // Chọn độ khó game
  if (id("size-1").checked) {
    if (id("diff-1").checked) {
      ar = [...easy1[rand]];
      board = [...easy1[rand]];
      result = [...easy1[rand]];
    } else if (id("diff-2").checked) {
      board = medium1[rand];
      ar = medium1[rand];
    } else {
      board = hard1[rand];
      ar = hard1[rand];
    }
  } else if (id("size-2").checked) {
    if (id("diff-1").checked) {
      board = easy[rand];
      ar = easy[rand];
    } else if (id("diff-2").checked) {
      board = medium[rand];
      ar = easy[rand];
    } else {
      ar = easy[rand];
      board = hard[rand];
    }
  }

  // Set số mạng là 3 và có thể click chọn số trong bàn
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Mạng: 3"; // set Text

  // Tạo ra bàn chơi theo độ khó game
  generatedBoard(board);
  //Bắt đầu thời gian đếm
  startTimer();
  //Set theme dựa vào người chơi
  if (id("theme-1").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }

  //Hiện các số bên phải
  id("number-container").classList.remove("hidden");

  id("pause").classList.remove("hidden");
  id("clear-btn").classList.remove("hidden");
}

// Khởi tạo bảng
function generatedBoard(board) {
  clearPrevious(); // Xóa ván chơi trước

  let idCount = 0; // Tạo id của số trong bàn

  document.addEventListener("keydown", function (event) {
    if (!isNaN(event.key)) {
      if (!selectedTile.textContent.includes(event.key.toString())) {
        selectedTile.textContent =
          selectedTile.textContent + " " + event.key.toString();
        selectedTile.classList.add("predict");
      }
    }
  });
  if (id("size-1").checked) {
    // Tạo 36 số
    flag = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        // Tạo ra 1 phần tử pagragaph
        let tile = document.createElement("p");

        // Kiểm tra kí tự tại vị trí có phải là khoảng trắng không
        if (ar[i][j] != 0) {
          // Gán số cho array
          tile.textContent = ar[i][j].toString();
        } else {
          // Nếu là khoảng trống
          // Tạo 1 event lắng nghe

          tile.addEventListener("click", function () {
            if (!disableSelect) {
              // Nếu số được chọn
              if (tile.classList.contains("selected")) {
                // bỏ chọn
                tile.classList.remove("selected");
                selectedTile = null;
              } else {
                // bỏ chọn tất cả các số
                for (let i = 0; i < 36; i++) {
                  qsa(".tile1")[i].classList.remove("selected");
                }

                // Cập nhật giá trị
                tile.classList.add("selected");
                selectedTile = tile;
                updateMove();
              }
            }
          });
        }

        tile.id = idCount; // Gán id cho số;
        idCount++;

        // Đưa tất cả số vào trong Class
        tile.classList.add("tile1");
        if (i == 1 || i == 3) {
          // Nếu các số này nằm ở rìa cạnh dưới 3 ô vuông nằm ngang đầu tiên sẽ tạo thành 1 cạnh
          tile.classList.add("bottomBorder");
        }
        if (j == 2) {
          // Nếu các số nằm rìa cạnh phải ô vuông
          tile.classList.add("rightBorder");
        }

        // Add các số vào bàn chơi
        id("board").appendChild(tile);
      }
    }
  } else if (id("size-2").checked) {
    flag = 1;

    // Duyệt mảng
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Tạo ra 1 phần tử pagragaph
        let tile = document.createElement("p");

        // Kiểm tra kí tự tại vị trí có phải là khoảng trắng không
        if (ar[i][j] != 0) {
          // Gán số cho array
          tile.textContent = ar[i][j].toString();
        } else {
          // Nếu là khoảng trống
          // Tạo 1 event lắng nghe

          tile.addEventListener("click", function () {
            if (!disableSelect) {
              // Nếu số được chọn
              if (tile.classList.contains("selected")) {
                // bỏ chọn
                tile.classList.remove("selected");
                selectedTile = null;
              } else {
                // bỏ chọn tất cả các số
                for (let i = 0; i < 81; i++) {
                  qsa(".tile")[i].classList.remove("selected");
                }

                // Cập nhật giá trị
                tile.classList.add("selected");
                selectedTile = tile;
                updateMove();
              }
            }
          });
        }

        tile.id = idCount; // Gán id cho số;
        idCount++;

        // Đưa tất cả số vào trong Class
        tile.classList.add("tile");
        if (i == 2 || i == 5) {
          // Nếu các số này nằm ở rìa cạnh dưới 3 ô vuông nằm ngang đầu tiên sẽ tạo thành 1 cạnh
          tile.classList.add("bottomBorder");
        }
        if (j == 2 || j == 5) {
          // Nếu các số nằm rìa cạnh phải ô vuông
          tile.classList.add("rightBorder");
        }

        // Add các số vào bàn chơi
        id("board").appendChild(tile);
      }
    }
  }
}

function updateMove() {
  // Nếu số trong bàn và số trong cột được chọn
  if (selectedTile && selectedNum) {
    selectedTile.classList.remove("predict");
    selectedTile.textContent = "";
    // Đặt số trong bàn thành số trong cột
    selectedTile.textContent = selectedNum.textContent;

    // Kiểm tra xem số trong bàn có phù hợp với đáp án không
    if (checkCorrect(selectedTile)) {
      // Bỏ chọn số
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");

      //Kiểm tra nếu game hoàn thành
      if (checkDone()) {
        endGame();
      }

      // Clear số
      selectedNum = null;
      selectedTile = null;
    } else {
      // Nếu số được chọn không phù hợp
      disableSelect = true;

      // Số được chọn thành màu đỏ
      selectedTile.classList.add("incorrect");

      // Chạy hàm trong 1s
      setTimeout(function () {
        // Giảm số mạng
        lives--;
        // Nếu không còn mạng, kết thúc trò chơi
        if (lives === 0) endGame();
        else {
          //Cập nhật lại số mạng trong text
          id("lives").textContent = "Mạng: " + lives;
          disableSelect = false;
        }

        //
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");

        // Clear kí tự trong bàn và clear giá trị được chọn bên cột phải
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }

  newResult = solve(result);
}

function endGame() {
  // Dừng thời gian và không cho di chuyển
  disableSelect = true;
  clearTimeout(timer);

  //Hiện thông báo thắng hoặc thua
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "Thua!";
  } else {
    id("lives").textContent = "Thắng!";
  }
}

function checkDone() {
  let tiles;

  if (flag == 0) {
    tiles = qsa(".tile1");
  } else if (flag == 1) {
    tiles = qsa(".tile");
  }
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }

  return true;
}

function checkCorrect(tile) {
  let row, col;

  if (flag == 1) {
    row = Math.floor(tile.id / 9);
    col = tile.id % 9;
  } else {
    col = tile.id % 6;
    row = Math.floor(tile.id / 6);
  }

  if (newResult[row][col].toString() === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  // Pass tất cả class tile vào array
  let tiles;

  if (id("size-1").checked) {
    tiles = qsa(".tile1");
  } else {
    tiles = qsa(".tile");
  }

  // Xóa từng tiles
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }

  while (id("board").firstChild) {
    id("board").removeChild(id("board").firstChild);
  }

  // Nếu còn biến thời gian, xóa nó
  if (timer) {
    clearTimeout(timer);
  }

  // Bỏ chọn các số nằm cột bên phải
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }

  // Xóa các số dược chọn trong bàn
  selectedTile = null;
  selectedNum = null;
}

function startTimer() {
  // Đặt thời gian dựa vào lựa chọn ng chơi
  if (id("time-1").checked) {
    timeRemaining = 300;
  } else if (id("time-2").checked) {
    timeRemaining = 600;
  } else timeRemaining = 900;

  // Đặt thời gian
  id("timer").textContent = timeConversion(timeRemaining);

  // Cập nhật thời gian mỗi giây
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}

// Chuyển thời gian từ số sang định dạng MM:SS
function timeConversion(time) {
  let minute = Math.floor(time / 60);
  if (minute < 10) minute = "0" + minute;

  let second = time % 60;
  if (second < 10) second = "0" + second;

  return minute + ":" + second;
}

// Thuật toán quay lui (Backtracking)
// Tìm tất cả các trường hợp có thể thỏa điều kiện bài toán, nếu không phù hợp sẽ đi đến trường hợp tiếp theo
// 1 dạng đệ quy

// Tìm số chưa được điền trong bảng, nếu giá trị == 0 sẽ trả về hàng và cột
function nextEmptySpot(board) {
  let kind;
  if (flag == 1) {
    kind = 9;
  } else {
    kind = 6;
  }

  // Duyệt mảng
  for (var i = 0; i < kind; i++) {
    for (var j = 0; j < kind; j++) {
      if (board[i][j] === 0) return [i, j]; // Trả về hàng và cột
    }
  }
  return [-1, -1]; // Nếu không có, trả về [-1,-1], kết thúc thuật toán
}

// Duyệt theo hàng, kiểm tra xem giá trị có tồn tại trong hàng hay chưa
function checkRow(board, row, value) {
  // Duyệt hàng
  for (var i = 0; i < board[row].length; i++) {
    // Kiểm tra giá trị
    if (board[row][i] === value) {
      return false; // Nếu có trả về false
    }
  }

  return true; // Nếu k có, trả về true
}

// Duyệt theo cột, kiểm tra xem giá trị có tồn tại trong cột hay chưa
function checkColumn(board, column, value) {
  // Duyệt cột
  for (var i = 0; i < board.length; i++) {
    // Kiểm tra giá trị
    if (board[i][column] === value) {
      // Nếu có trả về false
      return false;
    }
  }

  return true; // Nếu k có, trả về true
}

// Duyệt theo vùng, kiểm tra tất cả các giá trị nằm trong ô 3x3 có tồn tại giá trị đó hay không
function checkSquare(board, row, column, value) {
  // Tìm ra vị trí của vùng

  let boxRow, boxCol;
  if (flag == 0) {
    boxRow = Math.floor(row / 2) * 2;
    boxCol = Math.floor(column / 3) * 3;

    // Duyệt vùng, kiểm tra giá trị có tồn tại chưa
    for (var r = 0; r < 2; r++) {
      for (var c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === value) return false; // Nếu đã có, trả về false
      }
    }
  } else {
    // Giá trị sẽ gồm 3 trường hợp (0,3,6) tương ứng vị trí bắt đầu của vùng
    boxRow = Math.floor(row / 3) * 3;
    boxCol = Math.floor(column / 3) * 3;
    // Duyệt vùng, kiểm tra giá trị có tồn tại chưa
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === value) return false; // Nếu đã có, trả về false
      }
    }
  }

  return true; // Nếu chưa, trả về true
}

// Gộp tất cả các trường hợp duyệt, theo hàng, cột và vùng
function checkValue(board, row, column, value) {
  if (
    checkRow(board, row, value) &&
    checkColumn(board, column, value) &&
    checkSquare(board, row, column, value)
  ) {
    return true; // Nếu thỏa trả về true
  }

  return false; // Nếu không trả về false
}

function solve(board) {
  let emptySpot = nextEmptySpot(board); // Tìm vị trí giá trị 0 trong bảng
  let row = emptySpot[0]; // Dòng
  let col = emptySpot[1]; // Cột

  // Nếu không còn giá trị 0 trong bảng
  if (row === -1) {
    return board;
  }

  if (flag == 0) {
    // Duyệt các số có thể diền vào 1->9
    for (let num = 1; num <= 6; num++) {
      // Nếu số đó thỏa mãn trong ô cột và vùng đó
      if (checkValue(board, row, col, num)) {
        board[row][col] = num; // Gán giá trị tại ô đó
        solve(board); // Tìm các trường hợp khác
      }
    }
  } else {
    // Duyệt các số có thể diền vào 1->9
    for (let num = 1; num <= 9; num++) {
      // Nếu số đó thỏa mãn trong ô cột và vùng đó
      if (checkValue(board, row, col, num)) {
        board[row][col] = num; // Gán giá trị tại ô đó
        solve(board); // Tìm các trường hợp khác
      }
    }
  }

  if (nextEmptySpot(board)[0] !== -1) board[row][col] = 0; // Nếu k có số thỏa điều kiện

  return board;
}

// Helper function
// Tìm theo id
function id(id) {
  return document.getElementById(id);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
