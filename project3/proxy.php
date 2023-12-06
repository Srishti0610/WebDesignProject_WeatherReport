<?php
  // put your API key here:
  $appid = "app-id";

  header("Content-type: application/json\n\n");
  $params = $_SERVER['QUERY_STRING'];
  $host = "https://api.openweathermap.org/data/2.5/weather?$params&APPID=$appid";
  $ch = curl_init($host);
  curl_exec($ch);
  curl_close($ch);
?>
