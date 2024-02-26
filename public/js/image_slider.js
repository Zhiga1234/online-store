var currentIndex = 0;
        var images = document.querySelectorAll('.image-slider img');
        var prevBtn = document.getElementById('prevBtn');
        var nextBtn = document.getElementById('nextBtn');

        function showImage(index) {
            for (var i = 0; i < images.length; i++) {
                images[i].style.display = 'none';
            }
            images[index].style.display = 'block';
        }

        showImage(currentIndex);

        prevBtn.addEventListener('click', function() {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', function() {
            currentIndex++;
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            showImage(currentIndex);
        });