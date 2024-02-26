const targetDate = new Date("2023-11-22T11:08:00").getTime();
    
const countdownInterval = setInterval(function() {
const now = new Date().getTime();
const timeRemaining = targetDate - now;

const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

if (timeRemaining <= 0) {
    clearInterval(countdownInterval); 
    document.getElementById("countdown").innerHTML = "Sorry, the promotion has ended."; 

}
}, 1000);