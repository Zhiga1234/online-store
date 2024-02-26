jQuery(function($) {
    var do_translate = function() {
        $('html').i18n();
    }

    // Load translations and set up language switcher
    $.i18n().load({
        'en': '/en.json',
        'ru': '/ru.json'
    }).done(function() {
        // Event listener for language selection
        $('#lang-select').on('change', function() {
            // Set the selected locale
            var selectedLang = $(this).val();
            $.i18n().locale = selectedLang;
            // Translate the content
            do_translate();
            // Save the selected locale to localStorage
            localStorage.setItem('locale', selectedLang);
            // Send selected locale to server
            $.ajax({
                type: 'POST',
                url: '/setlocale', // Endpoint on your server
                data: { locale: selectedLang },
                success: function(response) {
                    console.log('Locale set on the server successfully.');
                },
                error: function(xhr, status, error) {
                    console.error('Error setting locale on the server:', error);
                }
            });
        });

        // Get the stored locale from localStorage or default to 'en'
        var storedLocale = localStorage.getItem('locale') || 'en';
        // Set the locale in the language switcher
        $('#lang-select').val(storedLocale);
        // Trigger change event to translate content initially
        $('#lang-select').change();
    });
});