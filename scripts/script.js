'use strict';

$(document).on('click', '#company_logout', function(){
  $.ajax({
    url: '/company_logout',
    method: 'post',
    success: function(data) {
      window.location.href = '/';
    },
    error: function(data) {
      console.log("error occurred");
    }
  });
});

$(document).on('click', '#user_logout', function(){
  $.ajax({
    url: '/user_logout',
    method: 'post',
    success: function(data) {
      window.location.href = '/';
    },
    error: function(data) {
      console.log("error occurred");
    }
  });
});

$(document).on("click", ".add-question", function () {
     var testId = $(this).data('test-id');
     $("#createQuestion .modal-body #test_id").val(testId);
});

$(document).on("click", ".publish", function () {
     var testId = $(this).data('test-id');
     console.log(testId);
     $.ajax({
       url: '/publish',
       method: 'post',
       data: {test_id: testId},
       success: function(data) {
         window.location.reload();
       },
       error: function(data) {
         console.log("error occurred");
       }
     });
});

$(document).on("click", "#filters", function () {
     var fields = [];
     if ($('#draft_status').prop('checked')) {
       fields.push('draft');
     }
     if ($('#publish_status').prop('checked')) {
       fields.push('published');
     }
     console.log(fields);
     window.location.href = '/tests?status=' + fields.toString();
});

$(document).on("click", '.table-row', function () {
    console.log("row clicked");
    window.location.href = $(this).data('href');
});
