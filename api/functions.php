<?php
use TextAnalysis\Analysis\Keywords\Rake;
use TextAnalysis\Documents\TokensDocument;
use TextAnalysis\Filters\LowerCaseFilter;
use TextAnalysis\Filters\StopWordsFilter;
use TextAnalysis\Tokenizers\GeneralTokenizer;
use TextAnalysis\Filters\SpacePunctuationFilter;
use TextAnalysis\Filters\PunctuationFilter;
use TextAnalysis\Filters\CharFilter;

function sample(){
	echo "Sample Functions";
}

function select_username($username) {
	$data = ORM::for_table('users')
	->where('username', $username)
	->find_one();

	return $data;
}

function create_table($username, $name, $course, $email, $password) {
	$users = ORM::for_table('users')->create();
	$users->username = $username;
	$users->name = $name;
	$users->course = $course;
	$users->email = $email;
	$users->password = $password;
	$users->save();
	// $result = array("success" => 1);
	// echo json_encode($result);

	return $users;
}

function read_table($username, $password) {
	$data = ORM::for_table('users')
    ->where('username', $username)
    ->where('password', $password)
    ->count();
	return $data;
}

function update_table($username, $name, $course, $email, $password) {
	$person = ORM::for_table('users')->where('username', $username)->find_one();
	$person->set('name', $name);
	$person->set('course', $course);
	$person->set('email', $email);
	$person->set('password', $password);
	$person->save();
	return $person;
}

function create_post($uid, $blogTitle, $blogContent, $blogCreator) {
	$post = ORM::for_table('user_blog')->create();
	$post->uid = $uid;
	$post->blog_title = $blogTitle;
	$post->blog_content = $blogContent;
	$post->blog_creator = $blogCreator;
	$post->status = 1;
	$post->save();

	return $post;
}

function read_blogs(){
	$data = ORM:: for_table('user_blog')
	->where("status", 1)
	->order_by_desc('id')
	->find_many();
		
	return $data;
}

function display_blog($u_id){
	$data = ORM:: for_table('user_blog')
	->where("uid", $u_id)
	->where("status", 1)
	->find_one();

	return $data;
}

function list_post(){
	$data = ORM:: for_table('user_blog')
	->find_many();

	return $data;
}

function read_to_update($u_id){
	$data = ORM:: for_table('user_blog')
	->where("uid", $u_id)
	->find_one();
	return $data;
}

function update_blog_status($uid_old){
	$data = ORM::for_table('user_blog')
	->where('uid', $uid_old)
	->find_one();
	$data->set('status', 2);
	$data->save();

	return $data;
}

function update_blog($uid_new, $blog_title, $blog_content, $blog_author){
	$data = ORM::for_table('user_blog')->create();
	$data->uid = $uid_new;
	$data->blog_title = $blog_title;
	$data->blog_content = $blog_content;
	$data->blog_creator = $blog_author;
	$data->status = 1;
	$data->save();

	return $data;
}

function delete_blog($uid_old){
	$data = ORM::for_table('user_blog')
	->where('uid', $uid_old)
	->find_one();
	$data->set('status', 0);
	$data->save();

	return $data;
}

function view_user_profile($user_name){
	$data = ORM::for_table('users')
	->where("username", $user_name)
	->where("status", 1)
	->find_one();

	return $data;
}

function user_created_blog($user_name){
	$data = ORM:: for_table('user_blog')
	->where("blog_creator", $user_name)
	->where("status", 1)
	->order_by_desc('id')
	->find_many();
	return $data;
}

function user_deleted_blog($user_name){
	$data = ORM:: for_table('user_blog')
	->where("blog_creator", $user_name)
	->where("status", 0)
	->order_by_desc('id')
	->find_many();
	return $data;
}

function read_comments($blog_uid){
	$data = ORM:: for_table('comments')
	->where("post_uid", $blog_uid)
	->order_by_desc('id')
	->find_many();
	return $data;
}

function create_comments($uid, $uid_blog, $user_name, $commentinputted){
		$data = ORM::for_table('comments')->create();
		$data->uid = $uid;
		$data->post_uid = $uid_blog;
		$data->username = $user_name;
		$data->comment = $commentinputted;
		$data->status = 1;
		$data->save();

		return $data;
	}

function my_truncate($string, $limit, $break=".", $pad=" [...]")
{
  // return with no change if string is shorter than $limit
  if(strlen($string) <= $limit) return $string;

  // is $break present between $limit and the end of the string?
  if(false !== ($breakpoint = strpos($string, $break, $limit))) {
    if($breakpoint < strlen($string) - 1) {
      $string = substr($string, 0, $breakpoint) . $pad;
    }
  }

  return $string;
}

function term_frequency($string){
	$nwords = str_word_count($string, 0); //no of words in a document
	$words = str_word_count($string, 1); //words in document
	$tfreq = array_count_values($words); //how often does word appear in document
	// $term_weight = [];

	// $term_weight = array_values($tfreq) / $nwords;
	// return $term_weight;
	// $print = print_r($tfreq, true);
	$token = tokenize($string);
	return $token;

}

function testRake($token)
    {
        $stopwords = array_map('trim', file('vendor/yooper/stop-words/data/stop-words_english_1_en.txt'));
        // all punctuation must be moved 1 over. Fixes issues with sentences
        $testData = (new SpacePunctuationFilter([':','\/']))->transform($token);
        //rake MUST be split on whitespace and new lines only
        $tokens = (new GeneralTokenizer(" \n\t\r"))->tokenize($testData);        
        $tokenDoc = new TokensDocument($tokens);
        $tokenDoc->applyTransformation(new LowerCaseFilter())
                ->applyTransformation(new StopWordsFilter($stopwords), false)
                ->applyTransformation(new PunctuationFilter(['@',':','\/']), false)
                ->applyTransformation(new CharFilter(), false);
                
        $rake = new Rake($tokenDoc, 2);
        $results = $rake->getKeywordScores();
        // $sort = asort($results);
        
        return $results;       
    }

?>