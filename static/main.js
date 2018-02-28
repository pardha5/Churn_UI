$(function() {

  // test to ensure jQuery is working
  console.log("whee!")
  $("#db_select").hide();
  $("#show_json").hide();

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

  $("#db_select").change(function(){

    var db = $ ("#db_select").val();
    var lab_id = $ ("#lab_select").val();
    console.log(db)
    console.log(lab_id)
    var db_request = $.ajax({
      type: 'GET',
      url: '/lab/db?lab_id=' + lab_id + '&db=' + db
    });

    db_request.done(function(data){

      console.log('got document data')
      console.log(data)
      p_data= JSON.parse(data);
      console.log(p_data);
      db_data = JSON.stringify(p_data, undefined, 2),
      //db_data = JSON.stringify(data, null, '  '),
      //result = db_data.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
      //document.getElementById("chosen_json").innerHTML = db_data;
      /*$.each($('.displayWrapper').children(),function(idx, child){
        $(child).html(JSON.stringify(data, null, 4));
      });*/
      console.log(db_data);
      
      $(".box").append(db_data);

    });

  });

  $("#submit-btn").click(function() {

    // grab values
    var lab = $("#lab_select").find(":selected").text();
    var db = $("#db_select").find(":selected").text();
    var lab_id = $("#lab_select").val();
    //var db_id = $("#db_select").val();

    // append values to the DOM
    $("#chosen_lab").html(lab);
    $("#chosen_db").html(db);
    $("#chosen_lab_id").html(lab_id);
    //$("#chosen_db_id").html(db_id);

    // show values selected
    $("#show_selection").show();
    $("#show_json").show();
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
    window.location.href = '/lab';
    $("#chosen_lab").html("");
    $("#chosen_db").html("");
    $("#chosen_lab_id").html("");
    //$("#chosen_db_id").html("");
    $(".box").html("");

    // hide values selected
    $("#show_selection").hide();
    $("#show_json").hide();
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

  $("#run-btn").click(function() {

    //$("#run-btn").prop("disabled", true);
    var db = $ ("#db_select").val();
    var lab = $("#lab_select").find(":selected").text();
    var ovr = $("#override").val();
    console.log(ovr)
    
    if(isJSON(ovr)){
      console.log(ovr)
      ovr_t = ovr.replace(/[\n\r\s]+/g, '').trim();
      console.log(ovr_t)
      //ovr_json = JSON.parse(ovr);
      //console.log(ovr_json);
      $("#run-btn").prop("disabled", true);
      //Ajax Call with the data obtained
      //convert data to JSON
      var data = {}
      data['lab'] = lab;
      data['db'] = db;
      data['ovr'] = ovr_t;
      console.log('data request obj for ajax call')
      console.log(data)
      var run_request = $.ajax({
      type: 'POST',
      url: '/lab/run',
      data: data,
      success: function(data) {
                console.log('Round call Success')
                //window.location.href = '/run?lab=' + lab + '&db=' + db;
            },
      error: function(error){
                console.log(error);
           }
      });

      run_request.done(function(data){
      console.log('Run Initiated')
      //window.location.href = '/run?db=' + db;
      });
    }
    else{
      alert("Not a Valid JSPN, Check Json format in override text area!!!");
      $("#run-btn").prop("disabled", false);
    }
    
    console.log(db)
    console.log(lab)

    /*var run_request = $.ajax({
      type: 'GET',
      url: '/lab/run?lab=' + lab + '&db=' + db,
      success: function(data) {
                window.location.href = '/run?lab=' + lab + '&db=' + db;
            },
      error: function(error){
                console.log(error);
           }
    });

    run_request.done(function(data){
      console.log('Run Initiated')
      //window.location.href = '/run?db=' + db;
    }); */
   
  });


   $("#mdfy-btn").click(function() {

    console.log('in mdfy button click')
    $("#mdfy").show();

   
  });

  function isJSON(str) {

    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;

  }

});