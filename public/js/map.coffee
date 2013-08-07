$(document).ready( () ->
  param = _getParameters()
  switch param.type
    when "search"
      $.ajax(
        url: "/navigate/searchmap"
        data:
          search: param.search
        success: (data) ->
          console.log(param.search)
          $("#map-wrapper").html(data);
          $("#map-directions-end").val(param.search);
      )

    when "directions"
      $.ajax(
        url: "/navigate/navmap"
        data:
          from: param.from
          to: param.to
        success: (data) ->
          $("#map-directions-start").val(param.from);
          $("#map-directions-end").val(param.to);
          $("#map-wrapper").html(data);
      )

  #get live feed elements
  $.getJSON('/report/getall',(data) ->
    console.log data
  )
)

###
  Extracts GET parameters from url
###
_getParameters = () ->
  pl     = /\+/g  #Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g
  decode = (s) -> return decodeURIComponent(s.replace(pl, " "));
  query  = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);
  return urlParams;