<?php
use TextAnalysis\Analysis\Keywords\Rake;
use TextAnalysis\Documents\TokensDocument;
use TextAnalysis\Filters\LowerCaseFilter;
use TextAnalysis\Filters\StopWordsFilter;
use TextAnalysis\Tokenizers\GeneralTokenizer;
use TextAnalysis\Filters\SpacePunctuationFilter;
use TextAnalysis\Filters\PunctuationFilter;
use TextAnalysis\Filters\CharFilter;
use TextAnalysis\Fieg\Bayes\Classifier;
use TextAnalysis\Fieg\Bayes\TokenizerInterface;
use TextAnalysis\Fieg\Bayes\Tokenizer\WhitespaceAndPunctuationTokenizer;


function sample(){
	echo "Sample Functions";
}

function select_username($username) {
	$data = ORM::for_table('users')
	->where('username', $username)
	->find_one();

	return $data;
}

function create_post_with_image($uid, $blog_title, $blog_content, $blog_image, $blog_creator, $naive){
	$post = ORM::for_table('user_blog')->create();
	$post->uid = $uid;
	$post->blog_title = $blog_title;
	$post->blog_content = $blog_content;
	$post->blog_image_name = $blog_image;
	$post->blog_creator = $blog_creator;
	$post->status = 1;
	$post->post_tag = $naive;
	$post->save();

	return $post;
}

function create_table($username, $studnum, $name, $course, $email, $password) {
	$users = ORM::for_table('users')->create();
	$users->username = $username;
	$users->studnum = $studnum;
	$users->name = $name;
	$users->course = $course;
	$users->email = $email;
	$users->password = $password;
	$users->save();

	return $users;
}

function read_table($username, $password) {
	$data = ORM::for_table('users')
    ->where('username', $username)
    ->where('password', $password)
    ->count();
	return $data;
}

function read_dept_table($username, $password) {
	$data = ORM::for_table('departments')
    ->where('dept_name', $username)
    ->where('dept_password', $password)
    ->count();
	return $data;
}

function read_dept_user() {
	$data = ORM::for_table('departments')
    ->having_not_like('dept_id', 1)
    ->order_by_desc('dept_id')
    ->find_many();
	return $data;
}

function render_dept_user($dept) {
	$data = ORM::for_table('departments')
    ->having_not_like('dept_id', 1)
    ->having_not_like('dept_name', $dept)
    ->order_by_desc('dept_id')
    ->find_many();
	return $data;
}

function read_message_from_user($dept_id) {
	$data = ORM::for_table('chat_message')
    ->raw_query('SELECT DISTINCT id, username from 
    	users join chat_message on 
    	users.username = chat_message.from_user_name
    	WHERE to_dept_id = :id', array('id' => $dept_id))
    	->find_many();
    	return $data;
}

function fetch_dept_id($dept_name){
	$data = ORM::for_table('departments')
	->select('dept_id')
	->where('dept_name', $dept_name)
	->find_one();
	return $data;
}

function fetch_user_id($user_name){
	$data = ORM::for_table('users')
	->select('id')
	->where('username', $user_name)
	->find_one();
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

function create_post($uid, $blogTitle, $blogContent, $blogCreator, $naive) {
	$post = ORM::for_table('user_blog')->create();
	$post->uid = $uid;
	$post->blog_title = $blogTitle;
	$post->blog_content = $blogContent;
	$post->blog_creator = $blogCreator;
	$post->status = 1;
	$post->post_tag = $naive;
	$post->save();

	return $post;
}

function read_blogs(){
	$data = ORM:: for_table('user_blog')
	->where("status", 1)
	->order_by_desc('post_score_value')
	->find_many();
		
	return $data;
}

function search($term){
	$data = ORM::for_table('user_blog')
    ->raw_query('SELECT * FROM user_blog
    	WHERE blog_content LIKE :id', array( 'id' => $term))
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

function update_blog($uid, $blog_title, $blog_content, $blog_creator, $naive){
	$data = ORM::for_table('user_blog')
	->where('uid', $uid)
	->find_one();
	$data->blog_title = $blog_title;
	$data->blog_content = $blog_content;
	$data->post_tag = $naive;
	$data->blog_creator = $blog_creator;
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

function categorize_post($tag){
	$data = ORM::for_table('user_blog')
	->where("post_tag", $tag)
	->where("status", 1)
	->order_by_desc('id')
	->find_many();
	return $data;
}

function insert_message($uid, $from_user_name, $to_dept_id, $chat_message){
	$data = ORM::for_table('chat_message')->create();
		$data->uid = $uid;
		$data->to_dept_id = $to_dept_id;
		$data->from_user_name = $from_user_name;
		$data->chat_message = $chat_message;
		$data->status = 1;
		$data->save();

		// return $data;
}

function chat_history($from_user_name, $to_dept_id, $to_user_name, $user_id){
	$data = ORM::for_table('chat_message')
	->where_in("from_user_name", array($from_user_name, $to_user_name))
	->where_in("to_dept_id", array($to_dept_id, $user_id))
	->order_by_desc('timestamp')
	->find_many();
	
	return $data;
}

function select_ip($id, $ip){
	$data = ORM::for_table('voting_ip')
	->where("mes_id_fk", $id)
	->where("ip_add", $ip)
	->find_one();

	return $data;
}

function up_vote($id){
	$data = ORM::for_table('user_blog')
	->raw_query('UPDATE user_blog SET post_vote_up 
		= post_vote_up + 1 WHERE uid=$id')
    	->save();
    	return $data;
}

function insert_ip($id, $ip){
	$data = ORM::for_table('voting_ip')->create();
	$data->mes_id_fk = $id;
	$data->ip_add = $ip;
	$data->save();

}
//voting must function
function post_must($uid){
	$data = ORM::for_table('user_blog')
	->where("uid", $uid)
	->find_one();
	$data->post_vote_must += 1;
	$data->save();

    // return $data;
}

function return_must($uid){
	$data =  ORM::for_table('user_blog')
	->select("post_vote_must")
	->where("uid", $uid)
	->find_one();
	return $data;
}
//end 

//voting immediate function
function post_immediate($uid){
	$data = ORM::for_table('user_blog')
	->where("uid", $uid)
	->find_one();
	$data->post_vote_immediate += 1;
	$data->save();

    // return $data;
}

function return_immediate($uid){
	$data =  ORM::for_table('user_blog')
	->select("post_vote_immediate")
	->where("uid", $uid)
	->find_one();
	return $data;
}
//end

//voting normal function
function post_normal($uid){
	$data = ORM::for_table('user_blog')
	->where("uid", $uid)
	->find_one();
	$data->post_vote_normal += 1;
	$data->save();

    // return $data;
}

function return_normal($uid){
	$data =  ORM::for_table('user_blog')
	->select("post_vote_normal")
	->where("uid", $uid)
	->find_one();
	return $data;
}
//end

function if_user_voted($uid, $user){
	$data = ORM::for_table('voting_ip')
	->where("mes_id_fk", $uid)
	->where("user_voted", $user)
	->find_one();

	return $data;
}

function insert_voter($uid, $user, $num){
	$vote = ORM::for_table('voting_ip')->create();
	$vote->mes_id_fk = $uid;
	$vote->user_voted = $user;
	$vote->user_vote_type = $num;
	$vote->save();

	return $vote;
}

function vote_type($uid, $user){
	$data = ORM::for_table('voting_ip')
	->select("user_vote_type")
	->where("mes_id_fk", $uid)
	->where("user_voted", $user)
	->find_one();

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

function bayesian($string){
	$nb = naive_bayes();
	$nb->train('No Category', tokenize('acs1a5ca sd6vsdv asvadrhbs dbvagvs avasv pjapcj'));
	$nb->train('Security', tokenize('security guard dress code security uniform ID bomb threat gate damit buhok civilian'));
	$nb->train('Administration', tokenize('admin payments administration pila slow processing administrator personnel TOR school records'));
	$nb->train('Gender And Development', tokenize('gender and development gender discrimination gender preference offensive GAD gay lesbian bisexual transgender catcall girl boy harassment'));
	$nb->train('Guidance', tokenize('student behavior harassment abuse student case guidance nagaway nagsuntukan sapakan bully'));
	$nb->train('Central Student Government', tokenize('central student government student issues project of csg fee election aso additional payment'));
	$nb->train('Office of Student Affairs and Services', tokenize('office of student affairs and services exchange scholarship grant assistant job experience program JEP SA subject osas'));

	$results = array_keys($nb->predict(tokenize($string)));

	return $results;
}

function calculate_score($a, $b, $c){
	$b = $b * 0.2;
	$c = $c * 0.1;

	$score = $a + $b + $c;
	$score = $score / 3;
	$score = round($score, 5);

	return $score;
}

function insert_score($value, $uid){
	$vote = ORM::for_table('user_blog')
	->where("uid", $uid)
	->find_one();
	$vote->post_score_value += $value;
	$vote->save();
}

?>