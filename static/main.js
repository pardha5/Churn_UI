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
      window.localStorage.setItem("db_data", db_data);
      
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

    $("#run-btn").prop("disabled", true);
    var db = $ ("#db_select").val();
    var host_lab = $("#lab_select").find(":selected").text();
    var ovr = $("#override").val();
    var cache;
    var m_t = parseInt($("#m_t").val());
    var log_lvl = $('input[name=logradio]:checked').val(); 
    //set cache value for the command
    if($('input[type=checkbox]').prop('checked')){
      cache = 1;
    }
    else{
      cache = 0;
    }
    //validate max_threads to be in the range specified if not in range assign default 64
    if(m_t<64 || m_t>256){
      m_t=64;
    }
    console.log(ovr)
    console.log(cache)
    console.log(m_t)
    console.log(log_lvl)
    if(isJSON(ovr)){
      console.log(ovr)
      ovr_t = ovr.replace(/[\n\r\s]+/g, '').trim();
      console.log(ovr_t)
      //ovr_json = JSON.parse(ovr);
      //console.log(ovr_json);
      //Ajax Call with the data obtained
      //convert data to JSON
      var data = {}
      data['hlab'] = host_lab;
      data['db'] = db;
      data['ovr'] = ovr_t;
      data['cache'] = cache;
      data['m_t'] = m_t;
      data['log_lvl'] = log_lvl;
      console.log('data request obj for ajax call')
      console.log(data)
      var run_request = $.ajax({
      type: 'POST',
      url: '/lab/run',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(data),
      success: function(data) {
                console.log('Round call Success')
                console.log(data)
                data = JSON.parse(data);
                console.log(data['lab'])
                console.log('#####parse ovr to support pre tag')
                console.log(data['ovr'])
                p_ovr= JSON.parse(data['ovr']);
                console.log(p_ovr);
                ovr_s = JSON.stringify(p_ovr, undefined, 2);
                console.log(ovr_s);
                window.localStorage.setItem("cmd", data['cmd']);
                window.localStorage.setItem("lab", data['hlab']);
                window.localStorage.setItem("db", data['db']);
                window.localStorage.setItem("ovr", ovr_s);
                window.localStorage.setItem("cache", data['cache']);
                window.localStorage.setItem("m_t", data['m_t']);
                window.localStorage.setItem("log_lvl", data['log_lvl']);
                //window.location.href = '/run?lab=' + data['hlab'] + '&db=' + data['db']+ '&ovr=' + ovr_s+ '&cache=' + data['cache']+ '&m_t=' + data['m_t']+ '&log_lvl=' + data['log_lvl'];
                window.location.href = '/run';
            },
      error: function(error){
                console.log(error);
           }
      });

      run_request.done(function(data){
      console.log('Run Initiated')
      console.log(data)
      //window.location.href = '/run?db=' + db;
      });
    }
    else{
      alert("Not a Valid JSPN, Check Json format in override text area!!!");
      $("#run-btn").prop("disabled", false);
    }
    
    console.log(db)
    console.log(host_lab)

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
    $(".container_modify").width("750px")
    $('#left').animate({
      'marginLeft' : "-=0px"
    });
    $("#mdfy").show();
    $("#mdfy-btn").prop("disabled", true);
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