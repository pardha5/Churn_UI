$(function(){
    $('#return-btn').click(function() {
    window.location.href = '/lab';
    //return false;
    });
    //get values from window and place in html
    $("#cmd").html(window.localStorage.getItem("cmd"));
    $("#lab,#lab_name").html(window.localStorage.getItem("lab"));
    $("#db,#db_name").html(window.localStorage.getItem("db"));
    $("#ovr").html(window.localStorage.getItem("ovr"));
    $("#cache").html(window.localStorage.getItem("cache"));
    $("#m_t").html(window.localStorage.getItem("m_t"));
    $("#log_lvl").html(window.localStorage.getItem("log_lvl"));
    $("#db_data").html(window.localStorage.getItem("db_data"));
});
