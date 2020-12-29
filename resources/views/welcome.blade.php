<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
		<link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
      
        <meta name="_token" content="{{ csrf_token() }}">
    </head>
    <body>
        <div id="root"></div>

        <?php
            // print_r($_POST);
            if(isset($_POST['razorpay_payment_id']))
            {
                echo"<input id='payid' type='hidden' value='".$_POST['razorpay_payment_id']."'>" ;
            }
        
        ?>
		
	<script src="{{ asset('js/app.js') }}" defer></script>
    </body>
</html>
