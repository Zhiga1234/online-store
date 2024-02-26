var texts = [
    "We're fashion enthusiasts at Tabu, where style is your unique expression.",
    "Explore fashionable clothing that complements your taste.",
    "Established in 2023 on October 1st"
];
var currentTextIndex = 0;
var textElement = document.getElementById('text');
var textPrevBtn = document.getElementById('textPrevBtn');
var textNextBtn = document.getElementById('textNextBtn');

function showText(index) {
    textElement.textContent = texts[index];
}

showText(currentTextIndex);

textPrevBtn.addEventListener('click', function() {
    currentTextIndex = (currentTextIndex - 1 + texts.length) % texts.length;
    showText(currentTextIndex);
});

textNextBtn.addEventListener('click', function() {
    currentTextIndex = (currentTextIndex + 1) % texts.length;
    showText(currentTextIndex);
});

