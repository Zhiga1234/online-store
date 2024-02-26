
const imagesIndex = document.querySelectorAll('.zoomable-image');


const modal = document.getElementById('imageModal');
const modalContent = document.getElementById('zoomedImg');

imagesIndex.forEach((image) => { 
  image.addEventListener('click', function () {
    modal.style.display = 'block';
    modalContent.src = this.src; 
  });
});

function closeModal() {
  modal.style.display = 'none';
}


const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', closeModal);


window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
