var brandImages = document.querySelectorAll('.brand-image');
    
        for (var i = 0; i < brandImages.length; i++) {
            brandImages[i].addEventListener('click', function() {
                var brandName = this.getAttribute('alt');
                alert("You clicked on " + brandName);
            });
        }