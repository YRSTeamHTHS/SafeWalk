$(document).ready( () ->
  pl     = /\+/g  #Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g
  decode = (s) -> return decodeURIComponent(s.replace(pl, " "));
  query  = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);
  console.log(urlParams);
)