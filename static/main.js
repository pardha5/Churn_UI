$(function() {

  // test to ensure jQuery is working
  console.log("whee!")
  $("#db_select").hide();

  // disable refresh button
  $("#refresh-btn").prop("disabled", true)

  $("#lab_select").change(function() {

    // grab value
    var lab_id = $("#lab_select").val();

    // send value via GET to URL /<lab_id>
    var get_request = $.ajax({
      type: 'GET',
      url: '/lab/' + lab_id + '/',
    });

    // handle response
    get_request.done(function(data){

      // data
      console.log('got the list data')
      console.log(data)
      console.log(data.length)
      // add values to list 
      var option_list = JSON.parse(data);
      option_list = ["Select a DB"].concat(option_list);
      console.log('after concat data')
      console.log(option_list.length)
      console.log(option_list[2])
      $("#db_select").empty();
        for (var i = 0; i < option_list.length; i++) {
          //console.log(option_list[i])
          $("#db_select").append(
            $("<option></option>").attr("value", option_list[i]).text(option_list[i]));
        }
      // show model list
      $("#db_select").show();
    });
  });

  $("#submit-btn").click(function() {

    // grab values
    var lab = $("#lab_select").find(":selected").text();
    var db = $("#db_select").find(":selected").text();
    var lab_id = $("#lab_select").val();
    var db_id = $("#db_select").val();

    // append values to the DOM
    $("#chosen_lab").html(lab);
    $("#chosen_db").html(db);
    $("#chosen_lab_id").html(lab_id);
    $("#chosen_db_id").html(db_id);

    // show values selected
    $("#show_selection").show();
    // enable refresh button
    $("#refresh-btn").prop("disabled", false)
    // disable submit button
    $("#submit-btn").prop("disabled", true);

    // disable dropdown inputs
    $("#db_select").prop("disabled", true);
    $("#lab_select").prop("disabled", true);
    $("#db_select").prop("disabled", true);
  });

  $("#refresh-btn").click(function() {

    // remove values to the DOM
    $("#chosen_lab").html("");
    $("#chosen_db").html("");
    $("#chosen_lab_id").html("");
    $("#chosen_db_id").html("");

    // hide values selected
    $("#show_selection").hide();
    // disable refresh button
    $("#refresh-btn").prop("disabled", true);
    // enable submit button
    $("#submit-btn").prop("disabled", false);
    // hide model list
    $("#db_select").hide();

    // enable dropdown inputs
    $("#db_select").prop("disabled", false);
    $("#lab_select").prop("disabled", false);

   
  });

});