let inputStates = {};

function defineListeners() {

    document.onkeydown = (event) => {

        if (event.key === "ArrowLeft") {
            inputStates.left = true;
        } else if (event.key === "ArrowRight") {
            inputStates.right = true;
        } else if (event.key === "ArrowUp") {
            inputStates.up = true;
        } else if (event.key === "ArrowDown") {
            inputStates.down = true;
        } else if (event.key === " ") {
            inputStates.space = true;
        }
        else if (event.key === "Space") {
            inputStates.space = true;
        }
    };

    document.onkeyup = (event) => {

        if (event.key === "ArrowLeft") {
            inputStates.left = false;
        } else if (event.key === "ArrowRight") {
            inputStates.right = false;
        } else if (event.key === "ArrowUp") {
            inputStates.up = false;
        } else if (event.key === "ArrowDown") {
            inputStates.down = false;
        } else if (event.key === " ") {
            inputStates.space = false;
        }
        else if (event.key === "Space") {
            inputStates.space = false;
        }
    };
}

export { defineListeners, inputStates };