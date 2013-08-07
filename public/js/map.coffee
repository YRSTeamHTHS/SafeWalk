$(document).ready( () ->
  param = _getParameters()
  switch param.type
    when "search"
      $.ajax(
        url: "/navigate/search"
        data:
          search: param.search
        success: (data) ->
          $("#map-wrapper").html(data);
      )
    when "directions"
      $.ajax(
        url: "/navigate/directions"
        data:
          from: param.from
          to: param.to
        success: (data) ->
          $("#map-wrapper").html(data);
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