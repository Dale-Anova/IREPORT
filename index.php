<?php
namespace Tests\TextAnalysis\Analysis\Keywords;
// namespace Tests\TextAnalysis\Classifiers;
use TextAnalysis\Documents\TokensDocument;
use TextAnalysis\Documents\DocumentAbstract;
use TextAnalysis\Collections\DocumentArrayCollection;
use TextAnalysis\Tokenizers\GeneralTokenizer;
use TextAnalysis\Indexes\TfIdf;
use TextAnalysis\Analysis\FreqDist;
use TextAnalysis\Analysis\Keywords\Rake;
use TextAnalysis\NGrams\NGramFactory;
use TextAnalysis\Classifiers\NaiveBayes;
use TextAnalysis\Fieg\Bayes\Classifier;
use TextAnalysis\Fieg\Bayes\Tokenizer\WhitespaceAndPunctuationTokenizer;


require 'connection.php';
require 'Slim/Slim.php';
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
	$studnum  = $_POST['studnum'];
	$username = $_POST['username'];
	$name	  = $_POST['name'];
	$course   = $_POST['course'];
	$email	  = $_POST['email'];
	$password = $_POST['password'];

	$data = select_username($username);

	if($data){
		$success = 0;
	} else {
		$result = create_table($username, $studnum, $name, $course, $email, $password);
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

$app->post("/deptLogin/", function() {
	$username = $_POST["username"];
	$password = $_POST["password"];
	$result = read_dept_table($username, $password);	

	echo json_encode($result);
});

$app->post("/blog/:name", function($name) {
	$valid_extensions = array('jpeg', 'jpg', 'png', 'gif'); // valid extensions
	$path = 'uploads/'; // upload directory
	// echo $path;
	if($_FILES['image']){
		$img = $_FILES['image']['name'];
		$tmp = $_FILES['image']['tmp_name'];
		// // get uploaded file's extension
		$ext = strtolower(pathinfo($img, PATHINFO_EXTENSION));
		// // can upload same image using rand function
		$final_image = rand(1000,1000000).$img;
		// // check's valid format
		if(in_array($ext, $valid_extensions)) { 
			$path = $path.strtolower($final_image); 
			if(move_uploaded_file($tmp,$path)) {
				echo "<img src='$path' />";
				$blogTitle = $_POST['blog_title'];
				$blogContent = $_POST['blog_content'];
				$blogCreator = $name;
				$uid		 = substr(sha1("hdjfah" .  sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand()) . "hdah")), 1, 15);
				$bayes 		 = array_slice(bayesian($_POST['blog_content']), 0, 1);
				$naive       = $bayes[0];
				create_post_with_image($uid, $blogTitle, $blogContent, $path, $blogCreator, $naive);
			}
		} else {
			echo 'invalid';
		}
	} else {
		$path = "";
		$blogTitle = $_POST['blog_title'];
		$blogContent = $_POST['blog_content'];
		$blogCreator = $name;
		$uid		 = substr(sha1("hdjfah" .  sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand()) . "hdah")), 1, 15);
		$bayes 		 = array_slice(bayesian($_POST['blog_content']), 0, 1);
		$naive       = $bayes[0];
		create_post_with_image($uid, $blogTitle, $blogContent, $path, $blogCreator, $naive);
	}

	// if (!empty($_POST['blog_title']) || !empty($_POST['blog_content'])) {
	// 	$path = "";
	// 	$blogTitle = $_POST['blog_title'];
	// 	$blogContent = $_POST['blog_content'];
	// 	$blogCreator = $name;
	// 	$uid		 = substr(sha1("hdjfah" .  sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand()) . "hdah")), 1, 15);
	// 	$bayes 		 = array_slice(bayesian($_POST['blog_content']), 0, 1);
	// 	$naive       = $bayes[0];
	// 	create_post_with_image($uid, $blogTitle, $blogContent, $path, $blogCreator, $naive);
	// }
});

$app->get("/vote", function() {
	$vote = $_GET["num"];
	$uid = $_GET["id"];
	$user = $_GET["name"];
	$data = array();
	
	$auth = if_user_voted($uid, $user);

	if ($auth == false) {
		if ($vote == 0) {
			post_must($uid);
		}elseif ($vote == 1) {
			post_immediate($uid);
		}elseif ($vote == 2) {
			post_normal($uid);
		}
		$a = return_must($uid);
		$b = return_immediate($uid);
		$c = return_normal($uid);

		$value = calculate_score($a['post_vote_must'], $b['post_vote_immediate'], $c['post_vote_normal'] );
		insert_score($value, $uid);
		insert_voter($uid, $user, $vote);
	}else {
		$vote_type = vote_type($uid, $user);
		echo json_encode($vote_type['user_vote_type']);
	}

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
			// $corpus = ($response['blog_content']);
			// $token = tokenize($corpus);
			// $rake = rake($token, 2);
			// $results = $rake->getKeywordScores();
			// $rakeResult = testRake($response['blog_content']);
			$vote_must = return_must($response['uid']);
			$must = $vote_must['post_vote_must'];

			$vote_imme = return_immediate($response['uid']);
			$immediate = $vote_imme['post_vote_immediate'];

			$vote_norm = return_normal($response['uid']);
			$normal = $vote_norm['post_vote_normal'];

			$naive = $response['post_tag'];
			$algorithm = bayesian($response['blog_content']);

			$data[] = array(
				"uid"=>$response['uid'],
				"Title"=> $response['blog_title'],
			  	"Author"=> $response['blog_creator'],
			  	"Content"=> $text, 
			  	"DateCreated"=> $response['blog_created'],
			  	"DateModified"=> $response['blog_modified'],
			  	"Tags"=>$naive,
			  	"grades"=>$algorithm,
			  	"Image"=>$response['blog_image_name'],
			  	"must"=>$must,
			  	"immediate"=>$immediate,
			  	"normal"=>$normal
			);	
		}
	}

	echo json_encode( $data );
});

$app->get('/blogdisplay/:uid', function ($u_id) {
	$response = array();
	$results = display_blog($u_id);

	if($results) {
		$response = array(
			'uid'=> $results['uid'],
		  	'title'=> $results['blog_title'], 
		  	'content'=> $results['blog_content'],
		  	'author'=> $results['blog_creator'],
		  	'dateCreated'=> $results['blog_created'],
		  	'dateModified'=> $results['blog_modified'],
		  	'Status'=> $results['status'],
		  	'image'=>$results['blog_image_name']
		);
	}
	echo json_encode($response);
});

$app->get('/category/:tag', function($tag){
	$data = array();
	$results = categorize_post($tag);

	if($results) {
		foreach ($results as $response) {
			$data[] = array(
				"uid"=>$response['uid'],
				"Author"=>$response['blog_creator'],
				"Title"=> $response['blog_title'],
			  	'Content'=> $response['blog_content'],
			  	'DateCreated'=> $response['blog_created'],
			  	'DateModified'=> $response['blog_modified'],
			  	'Tag'=> $response['post_tag']
			);	
		}
	}
	echo json_encode($data);
});

$app->get('/search', function(){
	$term = $_GET['term'];
	$data = array();
	$results = search($term);

	if($results) {
		foreach ($results as $response) {
			$data[] = array(
				"uid"=>$response['uid'],
				"Author"=>$response['blog_creator'],
				"Title"=> $response['blog_title'],
			  	'Content'=> $response['blog_content'],
			  	'DateCreated'=> $response['blog_created'],
			  	'DateModified'=> $response['blog_modified'],
			  	'Tag'=> $response['post_tag']
			);	
		}
	}
	echo json_encode($data);
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
	$uid = $_POST['uid'];
	$blog_title =  $_POST['title'];
	$blog_content = $_POST['content'];
	$blog_creator = $_POST['author'];
	$bayes 		 = array_slice(bayesian($blog_content), 0, 1);
	$naive       = $bayes[0];

	$resultss = update_blog($uid, $blog_title, $blog_content, $blog_creator, $naive);
	
	if($resultss) {
		$success = 1;
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
			  	'DateModified'=> $response['blog_modified'],
			  	'author'=>$response['blog_creator'],
			  	'tag'=>$response['post_tag']
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

$app->get('/message', function(){
	$data = array();
	$results = read_dept_user();

	if($results){
		foreach ($results as $response) {
			$data[] = array(
				"dept_id"=>$response['dept_id'],
				"dept_name"=>$response['dept_name']
			);
		}
	}
	echo json_encode($data);
});

$app->get('/dept_render', function(){
	$dept = $_GET['from_user_name'];
	$data = array();
	$results = render_dept_user($dept);

	if($results){
		foreach ($results as $response) {
			$data[] = array(
				"dept_id"=>$response['dept_id'],
				"dept_name"=>$response['dept_name']
			);
		}
	}
	echo json_encode($data);
});

$app->post('/chat_message', function(){
	$valid_extensions = array('jpeg', 'jpg', 'png', 'pdf', 'doc', 'docx');
	$path = 'uploads/chat_message/';
	$from_user_name = $_POST['from_user_name'];
	$to_dept_id = $_POST['to_user_id'];
	$chat_message = $_POST['chat_message'];
	$uid = uniqid(rand()).date("YmdHis");
	$results = insert_message($uid, $from_user_name, $to_dept_id, $chat_message);

	// echo json_encode($results);

	if($_FILES['image']){
		$img = $_FILES['image']['name'];
		$tmp = $_FILES['image']['tmp_name'];
		// // get uploaded file's extension
		$ext = strtolower(pathinfo($img, PATHINFO_EXTENSION));
		// // can upload same image using rand function
		$final_image = rand(1000,1000000).$img;
		// // check's valid format
		if(in_array($ext, $valid_extensions)) { 
			$path = $path.strtolower($final_image); 
			if(move_uploaded_file($tmp,$path)) {
				echo "<img src='$path' />";
				$blogTitle = $_POST['blog_title'];
				$blogContent = $_POST['blog_content'];
				$blogCreator = $name;
				$uid		 = substr(sha1("hdjfah" .  sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand()) . "hdah")), 1, 15);
				$bayes 		 = array_slice(bayesian($_POST['blog_content']), 0, 1);
				$naive       = $bayes[0];
				create_post_with_image($uid, $blogTitle, $blogContent, $path, $blogCreator, $naive);
			}
		} else {
			echo 'invalid';
		}
	} else {
		$path = "";
		$blogTitle = $_POST['blog_title'];
		$blogContent = $_POST['blog_content'];
		$blogCreator = $name;
		$uid		 = substr(sha1("hdjfah" .  sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand())) . sha1(uniqid(mt_rand()) . "hdah")), 1, 15);
		$bayes 		 = array_slice(bayesian($_POST['blog_content']), 0, 1);
		$naive       = $bayes[0];
		create_post_with_image($uid, $blogTitle, $blogContent, $path, $blogCreator, $naive);
	}
});

$app->get('/chat_history', function(){
	$from_user_name = $_GET['from_user_name'];
	$to_dept_id = $_GET['to_user_id'];
	$to_user_name = $_GET['to_user_name'];
	$user_id = fetch_user_id($from_user_name);
	$data = array();
	$history = chat_history($from_user_name, $to_dept_id, $to_user_name, $user_id['id']);

	if($history){
		foreach ($history as $response) {
			$data[] = array(
				"uid"=>$response['uid'],
				"to_dept_id"=>$response['to_dept_id'],
				"from_user_name"=>$response['from_user_name'],
				"chat_message"=>$response['chat_message'],
				"timestamp"=>$response['timestamp']
			);
		}
	}
	echo json_encode($data);
});

$app->get('/dept_message', function(){
	$dept_name = $_GET['dept_name'];
	$deptID = array();
	$data = array();
	$id = fetch_dept_id($dept_name);

	$results = read_message_from_user($id['dept_id']);
	if($results){
		foreach ($results as $response) {
			$data[] = array(
				"user_id"=>$response['id'],
				"user_name"=>$response['username']
			);
		}
	}
	echo json_encode($data);

});

$app->post('/dept_chat_message', function(){
	$to_user_name = $_POST['from_user_name'];
	$from_dept_id = $_POST['to_user_id'];
	$chat_message = $_POST['chat_message'];
	$uid = uniqid(rand(),true).date("YmdHis");
	$results = insert_message($uid, $to_user_name, $from_dept_id, $chat_message);
});

$app->get('/dept_chat_history', function(){
	$to_user_name = $_GET['to_user_name'];
	$from_dept_name = $_GET['from_dept_name'];
	$to_user_id = $_GET['to_user_id'];
	$dept_id = fetch_dept_id($from_dept_name);
	$data = array();
	$history = chat_history($from_dept_name, $to_user_id, $to_user_name, $dept_id['dept_id']);

	if($history){
		foreach ($history as $response) {
			$data[] = array(
				"uid"=>$response['uid'],
				"to_dept_id"=>$response['to_dept_id'],
				"from_user_name"=>$response['from_user_name'],
				"chat_message"=>$response['chat_message'],
				"timestamp"=>$response['timestamp']
			);
		}
	}
	echo json_encode($data);
});

$app->get('/dept_to_dept_chat_history', function(){
	$to_user_name = $_GET['to_user_name'];
	$from_dept_name = $_GET['from_user_name'];
	$to_user_id = $_GET['to_user_id'];
	$dept_id = fetch_dept_id($from_dept_name);
	$data = array();
	$history = chat_history($from_dept_name, $to_user_id, $to_user_name, $dept_id['dept_id']);

	if($history){
		foreach ($history as $response) {
			$data[] = array(
				"uid"=>$response['uid'],
				"to_dept_id"=>$response['to_dept_id'],
				"from_user_name"=>$response['from_user_name'],
				"chat_message"=>$response['chat_message'],
				"timestamp"=>$response['timestamp']
			);
		}
	}
	echo json_encode($data);
});

$app->post('/up_vote', function(){
	$ip = $_SERVER['REMOTE_ADDR'];
	if($_POST['id'])
	{
		$id = $_POST['id'];
		$ip_sql = select_ip($id, $ip);
		if ($ip_sql == 0) {
			$up_vote = up_vote($id);
			$insert_ip = insert_ip($id, $ip);
		}else {
			$vote_count = vote_count($id);
			return $vote_count;
		}
	}
});

$app->run();
?>