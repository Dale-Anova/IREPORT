<?php
namespace Tests\TextAnalysis\Analysis\Keywords;
use TextAnalysis\Documents\TokensDocument;
use TextAnalysis\Documents\DocumentAbstract;
use TextAnalysis\Collections\DocumentArrayCollection;
use TextAnalysis\Tokenizers\GeneralTokenizer;
use TextAnalysis\Indexes\TfIdf;
use TextAnalysis\Analysis\FreqDist;
use TextAnalysis\Analysis\Keywords\Rake;
use TextAnalysis\NGrams\NGramFactory;



require 'connection.php';
require 'Slim/Slim.php';
// require 'TfIdf.php';
// spl_autoload_register(function($TfIdf){
	// include $TfIdf . '.php';
// });
require_once('../vendor/autoload.php');
require 'functions.php';


\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get("/", function(){
	echo "sample";
	sample();
});

$app->post("/signup/", function(){
	$success = 0;
	$error = 0;
	$username = $_POST['username'];
	$name	  = $_POST['name'];
	$course   = $_POST['course'];
	$email	  = $_POST['email'];
	$password = $_POST['password'];

	$data = select_username($username);

	if($data){
		$success = 0;
	} else {
		$result = create_table($username, $name, $course, $email, $password);
		if ($result) {
			$success = 1;
		}
	}

	$response = array(
		"success" => $success);
	echo json_encode($response);
});

$app->post("/login/", function() {
	$username = $_POST["username"];
	$password = $_POST["password"];
	$result = read_table($username, $password);	

	echo json_encode($result);
});

$app->post("/blog/", function() {
	$str 		 = "asdfa";
	$blogTitle	 = $_POST["blog_title"];
	$blogContent = $_POST["blog_content"];
	$blogCreator = $_POST["blog_creator"];
	$uid		 = substr(sha1("hdjfah" .  sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand()) . "hdah")), 1, 15);
	create_post($uid, $blogTitle, $blogContent, $blogCreator);
});

$app->post("/update/", function() {
	$username    = $_POST["username"];
	$name        = $_POST["name"];
	$course      = $_POST["course"];
	$email       = $_POST["email"];
	$password    = $_POST["password"];
	update_table($username, $name, $birthday, $email, $password);
});

$app->get("/blogpost/", function() {
	$data = array();
	$results = read_blogs();

	if($results) {
		foreach ($results as $response) {
			$text = my_truncate($response['blog_content'], 200);
			$corpus = ($response['blog_content']);
			$token = tokenize($corpus);
			$rake = rake($token, 2);
			$results = $rake->getKeywordScores();
			$rakeResult = testRake($response['blog_content']);

			$data[] = array(
				"uid"=>$response['uid'],
				"Title"=> $response['blog_title'],
			  	"Author"=> $response['blog_creator'],
			  	"Content"=> $text, 
			  	"DateCreated"=> $response['blog_created'],
			  	"DateModified"=> $response['blog_modified'],
			  	"Tags"=>$rakeResult
			);	
		}
	}

	// $var = new TfIdf($data);
	echo json_encode( $data );
	// echo json_encode($data);
});

$app->get('/blogdisplay/:uid', function ($u_id) {
	$response = array();
	$results = display_blog($u_id);

	if($results) {
	$rakeResult = testRake($results['blog_content']);
		$response = array(
			'uid'=> $results['uid'],
		  	'title'=> $results['blog_title'], 
		  	'content'=> $results['blog_content'],
		  	'author'=> $results['blog_creator'],
		  	'dateCreated'=> $results['blog_created'],
		  	'dateModified'=> $results['blog_modified'],
		  	'Status'=> $results['status'],
		  	"Tags"=>$rakeResult
		);
	}
	echo json_encode($response);
});

$app->get('/listspost', function(){
	$response = array();
	$results = list_post();

	if ($results) {
		$response = array(
			'uid' => $results['uid'],
			'title' => $results['blog_title'],
			'content' => $results['blog_content'],
			'author' => $results['blog_creator'],
			'dateCreated' => $results['blog_created'],
			'dateModified' => $results['blog_modified']
		);
	}
	echo json_encode($response);
});

$app->get('/updateblog/:id', function ($u_id) {
	$response = array();
	$results = read_to_update($u_id);
	if($results) {
		$response = array(
			'uid'=> $results['uid'],
			'title'=> $results['blog_title'],
		  	'content'=> $results['blog_content'],
		);
	}
	echo json_encode($response);
});

$app->post('/updateblog', function () {
	$success = 0;
	$response = array();
	$blog_title =  $_POST['title'];
	$blog_content = $_POST['content'];
	$uid_new = uniqid(rand(),true).date("YmdHis");
	$uid_old = $_POST['uid'];
	$blog_author = $_POST['author'];

	$results = update_blog_status($uid_old);
	$resultss = update_blog($uid_new, $blog_title, $blog_content, $blog_author);
	
	if($results) {
		if($resultss) {
			$success = 1;
		}
	}

	$response = array(
		"success" => $success,
	);

	echo json_encode($response);
});

$app->post('/deleteblog', function () {
	$success = 0;
	$response = array();
	$uid_old = $_POST['uid'];
	$results = delete_blog($uid_old);

	if($results) {
		$success = 1;
	}
	
	$response = array(
		"success" => $success,
	);

	echo json_encode($response);
});

$app->get('/profile/:userLocal', function($user_name){
	$response = array();
	$success = 0;

	$results = view_user_profile($user_name);

	if($results) {
		$response = array(
			'uid'=> $results['id'],
		  	'username'=> $results['username'], 
		  	'fullname'=> $results['fullname'],
		  	'email'=> $results['email'],
		  	'course'=> $results['course'],
		);
	}
	echo json_encode($response);	
});

$app->get('/allblogs/:user_name', function($user_name){
	$data = array();
	$results = user_created_blog($user_name);

	if($results) {
		foreach ($results as $response) {
			$data[] = array(
				"uid"=>$response['uid'],
				"Title"=> $response['blog_title'],
			  	'Content'=> $response['blog_content'],
			  	'DateCreated'=> $response['blog_created'],
			  	'DateModified'=> $response['blog_modified']
			);	
		}
	}
	echo json_encode($data);
});

//display all blogs deleted by user
$app->get('/deletedblogs/:userLocal', function($user_name){
	$data = array();
	$results = user_deleted_blog($user_name);

	if($results) {
		foreach ($results as $responses) {
			$data[] = array(
				'Title'=> $responses['blog_title'],
			  	'Content'=> $responses['blog_content'],
			  	'DateDeleted'=> $responses['blog_modified']
			);	
		}
	}
	echo json_encode($data);	
});

$app->get('/commentplace/:uid', function($blog_uid){
	$data = array();
	$results = read_comments($blog_uid);
		
	if($results)
	{
		foreach($results as $responses){
			$data[] = array(
				"username" =>$responses['username'],
				"comments" => $responses['comment'],
				"datecommented" => $responses['date']
			);
		}
	}
	echo json_encode($data);
});


$app->post('/commentsection', function () {
	
	$success = 0;
	$uid = uniqid(rand(),true).date("YmdHis");
	$uid_blog = $_POST['uid'];

	$commentinputted =  $_POST['commentsection'];
	$user_name = $_POST['username'];

	$results = create_comments($uid, $uid_blog, $user_name, $commentinputted);
		
	if($results)
	{
		$success = 1;
	}
	
	$response = array(
		"success" => $success,
	);

	echo json_encode($response);
});

$app->get('/admin/', function(){
	$data = array();
	$results = read_blogs();

	if($results){
		foreach ($results as $response) {
			$text = my_truncate($response['blog_content'], 100);
			$data[] = array(
				"uid"=>$response['uid'],
				"Title"=>$response['blog_title'],
				"Author"=>$response['blog_creator'],
				"Content"=>$text,
				"DateCreated"=>$response['blog_created'],
				"DateModified"=>$response['blog_modified']
			);
		}
	}
	echo json_encode($data);
});

$app->run();
?>