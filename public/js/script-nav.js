$(document).ready(function() {
    // Function to handle input changes
    function handleInputChange() {
      var inputVal = $('#search-input').val().trim();
      var searchButton = $('#search-button');
      
      // Enable/disable the search button based on input value
      if (inputVal !== '') {
        searchButton.prop('disabled', false);
      } else {
        searchButton.prop('disabled', true);
      }
    }
    
    // Bind input change event
    $('#search-input').on('input', handleInputChange);
});