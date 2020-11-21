<?php

$method = strtoupper($_SERVER['REQUEST_METHOD']);
if('POST' != $method) {
	exit('Invalid request');
}

// CONFIGURE RECAPTCHA
define('GR_SECRET', 'xxxx');
define('GR_URL', 'https://www.google.com/recaptcha/api/siteverify');




// Configuration option.
// Enter the email address that you want to emails to be sent to.
// Example $address = "john.doe@yourdomain.com";
$address = "#";

function validateRecaptcha( $secret, $response, $url = GR_URL ){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	$params = array(
		'secret' => urlencode($secret),
		'response' => urlencode($response),
	);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	$result = json_decode($result);
	curl_close($ch);
	return (isset($result->success) && $result->success);
}


if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");

// Sanitize request
$email = (isset($_POST['email']) ? strip_tags($_POST['email']) : '');
$g_response = (isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '');

// Validate inputs

if(empty($email)){
	echo '<div class="alert alert-warning error"><p><strong>Attention!</strong> Email is required.</p></div>';
	exit();
}
if(filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
	echo '<div class="alert alert-warning error"><p><strong>Attention!</strong> You have entered an invalid e-mail address, try again.</p></div>';
	exit();
}
if(empty($g_response)){
	echo '<div class="alert alert-warning error"><p><strong>Attention!</strong> Please confirm you are not a robot by filling in the ReCaptcha.</p></div>';
	exit();
}
if(!validateRecaptcha(GR_SECRET, $g_response, GR_URL)){
	echo '<div class="alert alert-warning error"><p><strong>Attention!</strong> ReCaptcha is not correct.</p></div>';
	exit();
}


// Configuration option.
// You can change this if you feel that you need to.
// Developers, you may wish to add more fields to the form, in which case you must be sure to add them here.
$subject = "A new subscription.";
$e_body = "Email: $email," . PHP_EOL . PHP_EOL;


$msg = wordwrap( $e_body . $e_content . $e_reply, 70 );

$headers = "From: $email" . PHP_EOL;
$headers .= "Reply-To: $email" . PHP_EOL;
$headers .= "MIME-Version: 1.0" . PHP_EOL;
$headers .= "Content-type: text/plain; charset=utf-8" . PHP_EOL;
$headers .= "Content-Transfer-Encoding: quoted-printable" . PHP_EOL;

if(mail($address, $subject, $msg, $headers)) {

	// Email has sent successfully, echo an error message.
	echo '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><p>Thank you for subscribing!</p></div>';

} 
else {
	// Email has NOT been sent successfully, echo an error message.
	echo '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><div class="alert alert-danger"><strong>ERROR!</strong> The email was not sent, either try again or later.</div>';
}