<?php
   $json = $_POST['json'];
   $path = $_POST['path'];

   /* sanity check */
   if (json_decode($json) != null)
   {
     $file = fopen('../json/' .$path,'w+');
     fwrite($file, $json);
     fclose($file);
   }
   else
   {
     // user has posted invalid JSON, handle the error 
   }
?>