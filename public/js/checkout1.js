let card = document.getElementById("card").value;
var modal = document.getElementById('popup-modal');
var span = document.getElementsByClassName("modal-close")[0];

window.onload = function() {
    setTimeout(function() {
        modal.style.display = 'block';
    }, 3000);
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function check() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

function changeFunc() {
    var selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if (selectedValue == "Kaspi") {
        document.getElementById("cardlogo").src = "img/kaspi.png";
        document.getElementById("cardlogo").style.width = "auto";
        document.getElementById("cardlogo").style.height = "70px";
    }
    else if (selectedValue == "Visa") {
        document.getElementById("cardlogo").src = "img/visa.png";
        document.getElementById("cardlogo").style.height = "100px";
    }
}