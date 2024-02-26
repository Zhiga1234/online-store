
function openModal(imageSrc, imageName) {
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');

    modal.style.display = 'block';
    modalImage.src = imageSrc;
    modalImage.alt = imageName;
}


function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}


window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
