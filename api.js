var App = {
	api: "/ireport/api/index.php"
}

function clearPanel(){

}

function reloadPage(){
	location.reload(true);
}

function authentication() {
	var auth = sessionStorage.getItem("status");
	if (auth === "" || auth === null) {
		alert('You need to Sign In!');
		window.location.href = "#/login";
		window.location.reload(true);
	}
}

function log_auth(){
	var status = sessionStorage.getItem("status");
	if (status != "") {
		window.location.href = "#/blog";
	}
}

function getVote(int, uid) {
  var data = {num: int, id: uid};
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById("poll").innerHTML=this.responseText;
    }
  }
  xmlhttp.open("GET", App.api + "/vote/" + data,true);
  xmlhttp.send();
}

function votingFunc(int, uid){
	var user = sessionStorage.getItem("username");
	$.ajax({
        type: 'GET',
        url: App.api + '/vote',
        data: {num: int, id: uid, name: user},
        success: function(data){
        	if (data == "") {
        		alert("Your vote is successfully counted!");
        	}else {
        		alert("You already casted your vote into this post! Your vote is not counted!");
        	}
        }
    });
}

// function commentArea() {
// 	var status = sessionStorage.getItem("status");
// 	if (status == "student") {
// 		$("#commentsarea").hide();
// 	}else {
// 		$("#commentsarea").show();
// 	}
// }

function make_chat_dialog_box(to_user_id, to_user_name){
	var modal_content = '<div id="user_dialog_'+to_user_id+
	'" class="user_dialog" title="You have chat with ' +to_user_name+'">';
	modal_content += '<div style="height:400px; border:1px solid #ccc; overflow-y: scroll; margin-bottom:24px; padding:16px;" class="chat_history" data-touserid="'
	+to_user_id+'" id="chat_history_'+to_user_id+'">';
	modal_content += '</div>';
	modal_content += '<form id="chat" enctype="multipart/form-data">';
	modal_content += '<div class="form-group">';
	modal_content += '<label>Include File:</label>';
	modal_content += '<input id="uploadImage" type="file" name="image" class="form-control-file">';
	modal_content += '<div id="preview"></div><br>';
	modal_content += '</div>';
	modal_content += '<div id="err"></div>';
	modal_content += '<div class="form-group">';
	modal_content += '<textarea name="chat_message_'+to_user_id+'" id="chat_message_'+to_user_id+
	'" class="form-control"></textarea>';
	modal_content += '</div>';
	modal_content += '<div class="form-group" align="right">';
	modal_content += '<button type="submit" name="send_chat" id="'+to_user_id+'" class="btn btn-info send_chat" data-tousername="'+to_user_name+'">Send</button></div></div>';
	modal_content += '</form>';
  	$('#user_model_details').html(modal_content);
}

$.Mustache.options.warnOnMissingTemplates = true;
$.Mustache.load('template.html', function () {

	Path.map("#/prompt").to(function(){
		authentication();
		$('#target').html("").append($.Mustache.render("prompt"));
		$("#view").click(function(){
			window.location.href = "#/blog";
		});
		$("#state").click(function(){
			window.location.href = "#/message";
		});
		$("#email").click(function(){
			window.location.href = "#/email";
		})
	});


	Path.map("#/blog").to(function(){
		// authentication();
		$('#target').html("").append($.Mustache.render("blog"));

		$(document).ready(function(){
		    $('.search-box input[type="text"]').on("keyup input", function(){
		        /* Get input value on change */
		        var inputVal = $(this).val();
		        var resultDropdown = $(this).siblings(".result");
		        if(inputVal.length){
		            $.get(App.api + "/search", {term: inputVal}).done(function(results){
		                // Display the returned data in browser
		                // resultDropdown.html(data);
		                $.each( results, function( i, item ){
							let table = '';
								table += '<div class="box1"><button class="btn btn-success button vote" id="'+item.uid+'" name="up"> &and;</button>';
				    			table += '<p style="color:#777; margin-left:10px; margin-top:-10px">Like(s)</p>';
								table += '<button class="btn btn-danger button vote" id="'+item.uid+'" name="down"> &or;</button>';
				    			table += '<p style="color:#777; margin-left:10px; margin-top:-10px">Dislike(s)</p>';
								table += '</div>';
								table += '<div class="card">';
								table += '<h4>' + item.Title + '</h4>';
								table += '<small>' + item.DateCreated + '</small>';
								table += '<p>' + item.Author + '</p>';
								table += '<p>' + item.Content +'</p>';
								if (item.Image) {
									table += '<img src="../api/'+item.Image+'" alt="Image" style="width:100%; padding:20px;">';
								}
								table += '<a href="#/blogdisplay/'+item.uid+'">See more >> </a> ';
								table += '<p>Tag:   <a href="#/category/'+item.Tags+'">'+item.Tags+'</a></p>';
								table += '</div>';
								$('.result').append(table);
							});
		            });
		        } else{
		            resultDropdown.empty();
		        }
		    });
		    
		    // Set search input value on click of result item
		    $(document).on("click", ".result p", function(){
		        $(this).parents(".search-box").find('input[type="text"]').val($(this).text());
		        $(this).parent(".result").empty();
		    });
		});

		$("#post").submit(function(event) {
			event.preventDefault();
			var blogTitle = $("#blog_title").val();
			var blogContent = $("#blog_content").val();
			var blogCreator = sessionStorage.getItem("username");
			var ajax = null;
			var loadedUsers = 0;
			// var status = sessionStorage.getItem("status");

			if(blogTitle == ""){
			    blogTitle = "Untitled";
			}

			if (blogContent == "") {
			    alert('You have not inputted something');
			    return false;
			}else {
			    $.ajax({
			    	async: true,
			    	method: "POST",
			    	url: App.api + "/blog/" + blogCreator,
			    	data: new FormData(this),
			    	contentType: false,
				    cache: false,
				   	processData:false,
				   	beforeSend : function(){
					    $("#preview").fadeOut();
					   	$("#err").fadeOut();
				   	},
			    	success: function(data){
			    		// alert("Blog successfully created!");
			    		// window.location.href = "#/blog";
			    		// reloadPage();
			    		if(data =='invalid'){
					     // invalid file format.
					    	$("#err").html("Invalid File !").fadeIn();
					    }else{
					    	alert("Blog successfully created!");
			    			window.location.href = "#/blog";
			    			reloadPage();
					    }
					},
					error: function(e) {
					    $("#err").html(e).fadeIn();
					}  
			    });
			}
		});

		$(document).ready(function(){
			$("#logout").click(function(){
				window.location.href = "#/logout";
			});
			var status = sessionStorage.getItem("status");
			
			$("#message").click(function(){
				if (status == "student") {
					window.location.href = "#/message";
				}else{
					window.location.href = "#/dept_message";
				}
			});

			$.getJSON(App.api + "/blogpost/", function( results ){
				$.each( results, function( i, item ){
				let table = '';
					table += '<div class="card">';
					table += '<h4>' + item.Title + '</h4>';
					table += '<small>' + item.DateCreated + '</small>';
					table += '<p>' + item.Author + '</p>';
					table += '<p>' + item.Content +'</p>';
					if (item.Image) {
						table += '<img src="../api/'+item.Image+'" alt="Image" style="width:100%; padding:20px;">';
					}
					table += '<a href="#/blogdisplay/'+item.uid+'">See more >> </a> ';
					table += '<p>Tag:   <a href="#/category/'+item.Tags+'">'+item.Tags+'</a></p>';
					table += '<label class="checkbox-inline"><input id="'+item.uid+'" name="vote" type="radio" value="0" onclick="votingFunc(this.value, this.id);">Must <span>'+item.must+'</span></label>';
					table += '<label class="checkbox-inline"><input id="'+item.uid+'" name="vote" type="radio" value="1" onclick="votingFunc(this.value, this.id);">Immediate <span>'+item.immediate+'</span></label>';
					table += '<label class="checkbox-inline"><input id="'+item.uid+'" name="vote" type="radio" value="2" onclick="votingFunc(this.value, this.id);">Normal <span>'+item.normal+'</span></label>';
					table += '</div>';
					$('#output').append(table);
				});
			});
		});

		$(document).ready(function(){
			$('input[type="checkbox"]').click(function(){
	            if($(this).prop("checked") == true){
	                alert("Checkbox is checked.");
	            }
	            else if($(this).prop("checked") == false){
	                alert("Checkbox is unchecked.");
	            }
        	});

				$(".vote").click(function() {
					var id = $(this).attr("id");
					console.log(id);
					var name = $(this).attr("name");
					var dataString = 'id='+ id ;
					var parent = $(this);
					if(name=='up'){
						$.ajax({
						   type: "POST",
						   url: "up_vote.php",
						   data: dataString,
						   cache: false,
						   success: function(html){
						    parent.html(html);
						   }  
						});
					}else{
						$.ajax({
						   type: "POST",
						   url: "down_vote.php",
						   data: dataString,
						   cache: false,
						   success: function(html){
						       parent.html(html);
						  	}  
						});
					}
					return false;
				});
			});
	});

	Path.map("#/homepage").to(function(){
		// log_auth();
		$('#target').html("").append($.Mustache.render("homepage"));
		
		$(document).ready(function(){
			$("#logout").click(function(){
				window.location.href = "#/logout";
			});
			var status = sessionStorage.getItem("status");
			
			$("#message").click(function(){
				if (status == "student") {
					window.location.href = "#/message";
				}else{
					window.location.href = "#/dept_message";
				}
			});

			$.getJSON(App.api + "/blogpost/", function( results ){
				$.each( results, function( i, item ){
				let table = '';
					table += '<div class="card">';
					table += '<h4>' + item.Title + '</h4>';
					table += '<small>' + item.DateCreated + '</small>';
					table += '<p>' + item.Author + '</p>';
					table += '<p>' + item.Content +'</p>';
					if (item.Image) {
						table += '<img src="../api/'+item.Image+'" alt="Image" style="width:100%; padding:20px;">';
					}
					table += '<a href="#/blogdisplay/'+item.uid+'">See more >> </a> ';
					table += '<p>Tag:   <a href="#/category/'+item.Tags+'">'+item.Tags+'</a></p>';
					table += '</div>';
					$('#output').append(table);
				});
			});
		});
	});

	Path.map("#/update").to(function(){
		var viewData = {name : 'World'};
		$('target').html("").append($.Mustache.render("update"));
		$("#myForms").submit(function(event){
			event.preventDefault();

			var OldUsername = $("#oldUsername").val();
			var name = $("#name").val();
			var course = $("#course").val();
			var email = $("#email").val();
			var password = $("#password").val();

			$.ajax({
				method: "POST",
				url: App.api + "/update/",
				data: {
					username: OldUsername,
					name: name,
					course: course,
					email: email,
					password: password
				},
				success: function(data) {
					alert("Record updated successfully");
					$(location).attr('href', data);
				}
			});
		});
	});

	Path.map("#/login").to(function(){
		// log_auth();
		// var status = sessionStorage.getItem("status");
		// if (status != null || status != "") {
		// 	window.location.href = "#/blog";
		// }else{
			var viewData = {name: 'World'};
			$('#target').html("").append($.Mustache.render("login", viewData));
			$("#loginForms").submit(function(event){
				event.preventDefault();

				var logUname = $("#username").val();
				var logPass = $("#password").val();

				if (logUname == "" || logPass == ""){
					alert("please fill out all fields");
					return false;
				}

				$.ajax({
					method: "POST",
					url: App.api + "/login/",
					data: {
						username: logUname,
						password: logPass
					},
					success: function(data){
						if (data == 1) {
							sessionStorage.setItem("username", logUname);
							sessionStorage.setItem("status", 'student');
							location.replace("#/prompt");
						}else{
							alert('Invalid Username or password!');
							return false;
						}
					}
				});
			});
		// }
	});

	Path.map("#/deptLogin").to(function(){
		// log_auth();
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("dept_login", viewData));
		$("#loginForms").submit(function(event){
			event.preventDefault();

			var logUname = $("#dept_name").val();
			var logPass = $("#dept_password").val();

			if (logUname == "" || logPass == ""){
				alert("please fill out all fields");
				return false;
			}

			$.ajax({
				method: "POST",
				url: App.api + "/deptLogin/",
				data: {
					username: logUname,
					password: logPass
				},
				success: function(data){
					if (data == 1) {
						sessionStorage.setItem("department", logUname);
						sessionStorage.setItem("status", 'department');
						window.location.href = "#/blog";
					}else{
						alert('Invalid Username or password!');
						return false;
					}
				}
			});
		});
	});

	Path.map("#/signup").to(function(){
		// authentication();
		// if (status != null || status != "") {
		// 	window.location.href = "#/blog";
		// }
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("signup", viewData));

		function calcAge(dob){
			var ageDifMs = Date.now() - dob.getTime();
			var ageDate = new Date(ageDifMs);
			return Math.abs(ageDate.getUTCFullYear() - 1970);
		}

		$("#myForms").submit(function(event){
			event.preventDefault();

			var empStud = $("#studnum").val();
			var empUname = $("#username").val();
			var empName = $("#name").val();
			var empCourse = $("#course").val();
			var empEmail = $("#email").val();
			var empPass = $("#password").val();
			var empRpass =$("#confirm-password").val();


			if (empStud == "" || empName == "" || empCourse == "" || empEmail == ""
				|| empUname == "" || empPass == "" || empRpass == "") {
				alert("please fill out all fields");
				return false;
			}
			if (empRpass !== empPass) {
				alert("password mismatch");
				return false;
			}


			$.ajax({
				method: "POST",
				url: App.api + "/signup/",
				data: {
					studnum: empStud,
					username: empUname,
					name: empName,
					course: empCourse,
					email: empEmail,
					password: empPass
				},
				success:function(response){
					var data = JSON.parse(response);
					if(parseInt(data.success) == 1) {
						alert("User successfully created");
						window.location.href = "#/login";
						reloadPage();
					}else if(parseInt(data.success) == 0){
						alert("Username is already taken");
						return false;
					}
				}
			});
		});
	});

	Path.map("#/createblog").to(function(){
		authentication();
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("createblog"));
		$("#blog").submit(function(event){
			event.preventDefault();

			var blogTitle = $("#titleBlog").val();
			var blogContent = $("#contentBlog").val();
			var userLocal = sessionStorage.getItem("username");
			console.log(userLocal);

			if (blogTitle === "") {
				blogTitle = "Untitled";
			}
			if (blogContent === "") {
				alert("the post have no content.");
				return false;
			}else{
				$.ajax({
					method: "POST",
					url: App.api + "/post/",
					data: {
						post_title: blogTitle,
						post_content: blogContent,
						creator: userLocal
					},
					success: function(data){
						if (parseInt(data.success) == 1) {
							window.location.href = "#/blog";
							reloadPage();
						}
						alert("post created successfully");
						$(location).attr('href', data);
					}
				});
			}
		});
	});

	Path.map("#/category/:tag").to(function(){
		authentication();
		var post_tag = this.params['tag'];
		var viewData = { tag : post_tag };

	    $('#target').html("").append($.Mustache.render("category", viewData));

		$.getJSON(App.api + "/category/" + post_tag, function( results ){
			$.each( results, function( i, item ){
				let table = "";
				
				table += "<div class='card'>";
				table += "<h2>" + item.Title + "</h2>";
				table += "<small>" + item.DateCreated + "</small>";
				table += "<p>" + item.Author + "</p>";
				table += "<p>" + item.Content +"</p>";
				table += "<p><a href='#/blogdisplay/"+item.uid+
				"'>See more >></a></p>";
				table += "</div>";
				$('#output').append(table);
			});
		});
	});

	Path.map("#/blogdisplay/:id").to(function(){
		authentication();
		var uid = this.params['id'];
		var parse;
		var blogs = [];

		$(document).ready(function(){
		// commentArea();

		$.ajax({
			method: "GET",
			url: App.api + "/blogdisplay/" + uid,
			success: function(data){
				parse = JSON.parse(data);
				var blog = {
					title: parse.title,
					content: parse.content,
					author: parse.author,
					dateCreated: parse.dateCreated,
					image: parse.image
				};
				 if (parse.image == "") {
				 	$("img").hide();
				 }
				// $('#target').mustache('blogdisplay', blog);
				$('#target').html("").append($.Mustache.render("blogdisplay", blog));

				$("#backHome").click(function(){
					window.location.href = "#/blog";
				});

				$("#logout").click(function(){
					window.location.href = "#/logout";
				});

				$.getJSON(App.api + "/commentplace/" + uid, function( response ) {
				   	$.each( response, function( i, item  ) {
				    	let html ="";
						 	html += "<div>";
						 	html += "<h1>Username : "+item.username+"</h1>";
						 	html += "<h2>Comment : "+item.comments+"</h2>";
						 	html += "<h5>Date Commented : "+item.datecommented+"</h4>";
						 	html += "</div>";
						 	html += "<br>";
						 	html += "<br>";
						 	$("#commentsbyuser").append(html);
					});
				});
				$("#comments").submit(function(e){
					e.preventDefault();

					var comment = $("#commentsection").val();
					var userLocal = sessionStorage.getItem("username");

					if (comment === ""){
						alert("You have not commented anything");
						return false;
					}
					else
					{
						$.ajax({
						  	method: "POST",
						  	url: App.api  + "/commentsection",
						  	dataType: "json",
						  	data : {
						  		uid : uid,
					  			commentsection : comment,
					  			username : userLocal
					  		},
					  		success:function(response){
					  			if(parseInt(response.success) == 1){
							        alert("You Successfully Commented");
							        reloadPage();
							    }
					  		}
						});
					}
				});
			}
		});
		});
	});

	Path.map("#/admin").to(function(){
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("admin"));
		
		$.getJSON(App.api + "/admin/", function( results ){
			$.each( results, function( i, item ){
				var table = "";
				table += "<tr>";
				table += "<th scope='row' class='list'>"+item.Title+"</th>";
				table += "<td class='list'>"+item.Author+"</td>";
				table += "<td class='content'>"+item.Content+"</td>";
				table += "<td class='date'>"+item.DateCreated+"</td>";
				table += "<td class='date'>"+item.DateModified+"</td>";
				table += "<td><a href=#/blogdisplay/"+item.uid+
				">Inspect Post</a></td>";
				table += "<td><button class='delete btn btn-danger' id='"+item.uid+"'>Delete</button></td>";
				table += "</tr>";
				$("#blogposted tbody").append(table);
			});
				$('#blogposted').dataTable({
					"pageLength": 5,
					"lengthChange": false,
					"order": [[3, "desc"]],
					"language": {
      					"emptyTable": "No Blogs Posted Yet, Post One Now!!"
    				}
				});
			$("#logout").click(function(){
			window.location.href = "#/logout";
		});
			$("#profile").click(function(){
			window.location.href = "#/blog";
		});
			$("#homepage").click(function(){
			window.location.href = "#/blog";
		});
		$(document).ready(function(){
			$(".delete").click(function(){
				var uid = this.id;
				// console.log(uid);
				var c = confirm("Are you sure to DELETE post?");
				if (c == true) {
					$.ajax({
			  		method: "POST",
			  		url: App.api  + "/deleteblog",
			  		dataType: "json",
			  		data : {
			  			uid : uid,
			  		},
			  		success:function(response){
			  			if(parseInt(response.success) == 1){
					        alert("Blog Successfully Deleted");
					        reloadPage();
					    }
			  		}
				});
				}
			});
		});
	});
	});

	Path.map("#/message").to(function(){
		var viewData = {name: 'World'};

		$(document).on('click', '.start_chat', function(){
			var to_user_id = $(this).data('touserid');
			var to_user_name = $(this).data('tousername');
			make_chat_dialog_box(to_user_id, to_user_name);
			var from_user_name = sessionStorage.getItem("username");
  			var data = {
  				to_user_id: to_user_id, 
  				to_user_name: to_user_name,
  				from_user_name: from_user_name,
  				};
			$("#user_dialog_"+to_user_id).dialog({
				autoOpen:false,
				width:400
			});
			$('#user_dialog_'+to_user_id).dialog('open');

			// setInterval(function(){
				$.getJSON(App.api + "/chat_history", data, function( results ){
					var output = "";
					output = '<ul class="list-unstyled">';
					$.each( results, function( i, item ){
						var user_name = "";
						if (item.from_user_name == from_user_name) {
							user_name = '<b class="text-success">You</b>';
						}else {
							user_name = '<b class="text-danger">'+item.from_user_name+'</b>';
						}
						output += '<li style="border-bottom:1px dotted #ccc"><p>'+user_name+' - '+item.chat_message+'<div align="right"> - <small><em>'+item.timestamp+'</em></small></div></p></li>';
					});
					output += '</ul>';
					// $('#chat_message_'+to_user_id).val('');
					$('#chat_history_'+to_user_id).html(output);
				});
			// }, 3000);
		});

		$(document).on('click', '.send_chat', function(e){
			e.preventDefault();
  			var to_user_id = $(this).attr('id');
  			var to_user_name = $(this).data('tousername');
  			var chat_message = $('#chat_message_'+to_user_id).val();
  			var from_user_name = sessionStorage.getItem("username");
  			var data = {
  				to_user_id: to_user_id, 
  				to_user_name: to_user_name,
  				from_user_name: from_user_name,
  				};
  			
  			if (chat_message == "") {
  				alert('you do not have message!');
  				return false;
  			}else{
	  			$.ajax({
					method: "POST",
					url: App.api + "/chat_message",
				    data: new FormData(this),
				    contentType: false,
				    cache: false,
				   	processData:false,
				   	beforeSend : function(){
					    $("#preview").fadeOut();
					   	$("#err").fadeOut();
				   	},
				    success:function(){
				    // setInterval(function(){
	    				$.getJSON(App.api + "/chat_history", data, function( results ){
							let output = "";
							output = '<ul class="list-unstyled">';
							$.each( results, function( i, item ){
								var user_name = "";
								if (item.from_user_name == from_user_name) {
									user_name = '<b class="text-success">You</b>';
								}else {
									user_name = '<b class="text-danger">'+item.from_user_name+'</b>';
								}
								output += '<li style="border-bottom:1px dotted #ccc"><p>'+user_name+' - '+item.chat_message+'<div align="right"> - <small><em>'+item.timestamp+'</em></small></div></p></li>';
							});
							output += '</ul>';
							$('#chat_message_'+to_user_id).val('');
							$('#chat_history_'+to_user_id).html(output);
						});	  	
					// }, 5000);
			   		},
			   		error: function(e) {
					    $("#err").html(e).fadeIn();
					}
			  	});
	  		}
		});

		$('#target').html("").append($.Mustache.render("message"));
		
		$("#homepage").click(function(){
			window.location.href = "#/blog";
		});
		$("#logout").click(function(){
			window.location.href = "#/logout";
		});
		$("#process").click(function(){
			window.location.href = "#/process";
		});

		$.getJSON(App.api + "/message", function( results ){
			$.each( results, function( i, item){
				let table = "";
				table += "<tr>";
				table += "<td>"+item.dept_name+"</td>";
				table += "<td class='list'><button id='action' class='btn btn-info start_chat' data-touserid='"
				+item.dept_id+"' data-tousername='"+item.dept_name+"'>Start Chat</button></td>";
				table += "</tr>";
				$("#dept_message tbody").append(table);
			});
		});

	}).enter(clearPanel);

	Path.map("#/dept_message").to(function(){
		var viewData = {name: 'World'};

		$(document).on('click', '.start_chat', function(){
			var to_user_id = $(this).data('touserid');
			var to_user_name = $(this).data('tousername');
			make_chat_dialog_box(to_user_id, to_user_name);
			var from_dept_name = sessionStorage.getItem("department");
  			var data = {
  				to_user_id: to_user_id, 
  				to_user_name: to_user_name,
  				from_dept_name: from_dept_name,
  				};
			$("#user_dialog_"+to_user_id).dialog({
				autoOpen:false,
				width:400
			});
			$('#user_dialog_'+to_user_id).dialog('open');

			// setInterval(function(){
				$.getJSON(App.api + "/dept_chat_history", data, function( results ){
					let output = "";
					output = '<ul class="list-unstyled">';
					$.each( results, function( i, item ){
						var user_name = "";
						if (item.from_user_name == dept_name) {
							user_name = '<b class="text-success">You</b>';
						}else {
							user_name = '<b class="text-danger">'+item.from_user_name+'</b>';
						}
						output += '<li style="border-bottom:1px dotted #ccc"><p>'+user_name+' - '+item.chat_message+'<div align="right"> - <small><em>'+item.timestamp+'</em></small></div></p></li>';
					});
					output += '</ul>';
					// $('#chat_message_'+to_user_id).val('');
					$('#chat_history_'+to_user_id).html(output);
				});
			// }, 3000);
		});

		$(document).on('click', '.send_chat', function(){
  			var to_user_id = $(this).attr('id');
  			var to_user_name = $(this).data('tousername');
  			var chat_message = $('#chat_message_'+to_user_id).val();
  			var from_dept_name = sessionStorage.getItem("department");
  			var data = {
  				to_user_id: to_user_id, 
  				to_user_name: to_user_name,
  				from_dept_name: from_dept_name,
  				};
  			
  			if (chat_message == "") {
  				alert('you do not have message!');
  				return false;
  			}else{
	  			$.ajax({
					method: "POST",
					url: App.api + "/dept_chat_message",
				    data: {
				    	to_user_id: to_user_id, 
				    	chat_message: chat_message,
				    	from_user_name: from_dept_name
				    },
				    success:function(){
	   				
	   				// setInterval(function(){
						$.getJSON(App.api + "/dept_chat_history", data, function( results ){
							let output = "";
							output = '<ul class="list-unstyled">';
							$.each( results, function( i, item ){
								var user_name = "";
								if (item.from_user_name == dept_name) {
									user_name = '<b class="text-success">You</b>';
								}else {
									user_name = '<b class="text-danger">'+item.from_user_name+'</b>';
								}
								output += '<li style="border-bottom:1px dotted #ccc"><p>'+user_name+' - '+item.chat_message+'<div align="right"> - <small><em>'+item.timestamp+'</em></small></div></p></li>';
							});
							output += '</ul>';
							$('#chat_message_'+to_user_id).val('');
							$('#chat_history_'+to_user_id).html(output);
						});
					// }, 5000);
			   		}
			  	});
	  		}
	  	});

		$('#target').html("").append($.Mustache.render("dept_message"));
		
		$("#homepage").click(function(){
			window.location.href = "#/blog";
		});
		$("#logout").click(function(){
			window.location.href = "#/logout";
		});
		$("#message_dept").click(function(){
			window.location.href = "#/dept_to_dept";
		});

		var dept_name = sessionStorage.getItem("department");
		var data = {dept_name: dept_name};
		$.getJSON(App.api + "/dept_message", data, function( results ){
			$.each( results, function( i, item){
				let table = "";
				table += "<tr>";
				table += "<td>"+item.user_name+"</td>";
				table += "<td class='list'><button id='action' class='btn btn-info start_chat' data-touserid='"
				+item.user_id+"' data-tousername='"+item.user_name+"'>Start Chat</button></td>";
				table += "</tr>";
				$("#dept_message tbody").append(table);
			});
		});

	}).enter(clearPanel);

	Path.map("#/dept_to_dept").to(function(){
		var viewData = {name: 'World'};

		$(document).on('click', '.start_chat', function(){
			var to_user_id = $(this).data('touserid');
			var to_user_name = $(this).data('tousername');
			make_chat_dialog_box(to_user_id, to_user_name);
			var from_user_name = sessionStorage.getItem("department");
  			var data = {
  				to_user_id: to_user_id, 
  				to_user_name: to_user_name,
  				from_user_name: from_user_name,
  				};
			$("#user_dialog_"+to_user_id).dialog({
				autoOpen:false,
				width:400
			});
			$('#user_dialog_'+to_user_id).dialog('open');

			// setInterval(function(){
				$.getJSON(App.api + "/dept_to_dept_chat_history", data, function( results ){
					var output = "";
					output = '<ul class="list-unstyled">';
					$.each( results, function( i, item ){
						var user_name = "";
						if (item.from_user_name == from_user_name) {
							user_name = '<b class="text-success">You</b>';
						}else {
							user_name = '<b class="text-danger">'+item.from_user_name+'</b>';
						}
						output += '<li style="border-bottom:1px dotted #ccc"><p>'+user_name+' - '+item.chat_message+'<div align="right"> - <small><em>'+item.timestamp+'</em></small></div></p></li>';
					});
					output += '</ul>';
					$('#chat_history_'+to_user_id).html(output);
				});
			// }, 3000);
		});

		$(document).on('click', '.send_chat', function(){
  			var to_user_id = $(this).attr('id');
  			var to_user_name = $(this).data('tousername');
  			var chat_message = $('#chat_message_'+to_user_id).val();
  			var from_user_name = sessionStorage.getItem("department");
  			var data = {
  				to_user_id: to_user_id, 
  				to_user_name: to_user_name,
  				from_user_name: from_user_name,
  				};
  			
  			if (chat_message == "") {
  				alert('you do not have message!');
  				return false;
  			}else{
	  			$.ajax({
					method: "POST",
					url: App.api + "/chat_message",
				    data: {
				    	to_user_id: to_user_id, 
				    	chat_message: chat_message,
				    	from_user_name: from_user_name
				    },
				    success:function(){
				    // setInterval(function(){
	    				$.getJSON(App.api + "/dept_to_dept_chat_history", data, function( results ){
							let output = "";
							output = '<ul class="list-unstyled">';
							$.each( results, function( i, item ){
								var user_name = "";
								if (item.from_user_name == from_user_name) {
									user_name = '<b class="text-success">You</b>';
								}else {
									user_name = '<b class="text-danger">'+item.from_user_name+'</b>';
								}
								output += '<li style="border-bottom:1px dotted #ccc"><p>'+user_name+' - '+item.chat_message+'<div align="right"> - <small><em>'+item.timestamp+'</em></small></div></p></li>';
							});
							output += '</ul>';
							$('#chat_message_'+to_user_id).val('');
							$('#chat_history_'+to_user_id).html(output);
						});	  	
					// }, 5000);
			   		}
			  	});
	  		}
		});

		$('#target').html("").append($.Mustache.render("dept_to_dept"));
		
		$("#homepage").click(function(){
			window.location.href = "#/blog";
		});
		$("#logout").click(function(){
			window.location.href = "#/logout";
		});

		var from_user_name = sessionStorage.getItem("department");
		var data = {from_user_name: from_user_name}
		$.getJSON(App.api + "/dept_render", data, function( results ){
			$.each( results, function( i, item){
				let table = "";
				table += "<tr>";
				table += "<td>"+item.dept_name+"</td>";
				table += "<td class='list'><button id='action' class='btn btn-info start_chat' data-touserid='"
				+item.dept_id+"' data-tousername='"+item.dept_name+"'>Start Chat</button></td>";
				table += "</tr>";
				$("#dept_message tbody").append(table);
			});
		});

	});

	Path.map("#/profile").to(function(){
		authentication();
		var userLocal = sessionStorage.getItem("username")
		$('#target').html("").append($.Mustache.render("profile"));
		$(document).ready(function(){
		$.getJSON(App.api + "/allblogs/" + userLocal, function( results ){
				$.each( results, function( i, item  ) {	
				 	let container = '<div class="w3-container w3-card w3-white w3-round w3-margin"><br>';
					container += '<img src="../images/sample_pic.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">';
					container += '<span class="w3-right w3-opacity">'+item.DateCreated+'</span>';
					container += '<h4>'+item.author+'</h4><br>';
					container += '<hr class="w3-clear">';
					container += '<h5>'+item.Title+'</h5>';
					container += '<p>'+item.Content+'</p>';
				    container += '<a href="#/blogdisplay/'+item.uid+'">See more >> </a> ';
					container += '<p>Tag:   <a href="#/category/'+item.tag+'">'+item.tag+'</a></p>';
				    container += '<a href="#/update_report/'+item.uid+'" type="button"  class="w3-button w3-theme-d2 w3-margin-bottom">Update</a>';     
				    container += '<button id="action" class="w3-button w3-theme-d2 w3-margin-bottom delete" data-id="'+item.uid+'">Delete</button> ';         
				    container += '</div>';   
				    $('#post_on_profile').append(container);  
				});
		});
		$.getJSON(App.api + "/deletedblogs/" + userLocal, function( results ){
			$.each( results, function( i, item  ) {
				let container = '<div class="w3-container w3-card w3-white w3-round w3-margin"><br>';
				container += '<h5>'+item.Title+'</h5>';
				container += '<p>'+item.Content+'</p>';        
			    container += '</div>';   
			    $('#deleted_post_on_profile').append(container);
			});
		});

		$(document).on('click', '.delete', function(){
			var uid = $(this).data('id');
			var c = confirm("Are you sure to DELETE post?");
				if (c == true) {
					$.ajax({
			  		method: "POST",
			  		url: App.api  + "/deleteblog",
			  		data : {
			  			uid : uid,
			  		},
			  		success:function(response){
			  			var parse = JSON.parse(response);
						if(parse.success == 1){
					        alert("Report is deleted!");
					        reloadPage();
					    }
			  		}
				});
				}
		});
		});
	});

	Path.map("#/update_report/:id").to(function(){
		var uid = this.params['id'];
		var userLocal = sessionStorage.getItem("username");
		$('#target').html("").append($.Mustache.render("update_blog"));
		$.getJSON(App.api + "/updateblog/" + uid, function( results ){
			$.each( results, function( i, item  ) {
				$("#update_title").val(results.title);
				$("#update_content").val(results.content);
			});
		});
		$("#update_form").submit(function(e){
		 	e.preventDefault();

		 	var title = $("#update_title").val();
			var content = $("#update_content").val();

			$.ajax({
			  	method: "POST",
			  	url: App.api  + "/updateblog",
		 		data: {
		 			uid : uid,
			  		title : title,
			  		content : content,
			  		author : userLocal
			  	},
			  	success: function(response){
			  		var parse = JSON.parse(response);
					if(parse.success == 1){
			        alert("Report Successfully Updated");
			        window.location.href = "#/profile";
				    }
		  		}
			});
		});
	});

	Path.map("#/process").to(function(){
		$('#target').html("").append($.Mustache.render("process"));
	});

	Path.map("#/forget").to(function(){
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("forget",viewData));
		window.location.reload();
	}).enter(clearPanel);

	Path.map("#/logout").to(function(){
		alert("Logging you out");
	    sessionStorage.clear();
	    window.location.replace("#/homepage");
	    window.location.reload(true);
	});

	Path.root("#/homepage");

	Path.rescue(function(){
		alert("404: Route Not Found");
	});

	Path.listen();
});