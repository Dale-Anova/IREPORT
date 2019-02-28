var App = {
	api: "/ireport/api/index.php"
}

function clearPanel(){

}

function reloadPage(){
	location.reload();
}

function authentication() {
	var auth = localStorage.getItem("status");
	if (auth === "" || auth === null) {
		alert('You need to Sign In!');
		window.location.href = "#/login";
	}else {
		alert('You must Sign Out.');
		return false;
	}
}

var userLocal = localStorage.getItem("username");

// function commentArea() {
// 	if (postCreator != userLocal) {
// 		$(".commentsarea").show();
// 		$(".commentsarea").removeAttr("hidden");
// 	}else if (author == userLocal) {
// 		$(".commentsarea").hide();
// 	}
// }

$.Mustache.options.warnOnMissingTemplates = true;
$.Mustache.load('template.html', function () {

	Path.map("#/blog").to(function(){
		var viewData = { name: 'World'};
		$('#target').html("").append($.Mustache.render("blog"));
		$("#post").submit(function(event) {
		event.preventDefault();
		var blogTitle = $("#blog_title").val();
		var blogContent = $("#blog_content").val();
		var blogCreator = localStorage.getItem("username");

		if(blogTitle == ""){
		    	blogTitle = "Untitled";
		    }

		    if (blogContent == "") {
		    	alert('You have not inputted something');
		    	return false;
		    }else {
		    	$.ajax({
		    		method: "POST",
		    		url: App.api + "/blog/",
		    		data: {
		    			blog_title: blogTitle,
		    			blog_content: blogContent,
		    			blog_creator: blogCreator
		    		},
		    		success: function(data){
		    			alert("Blog successfully created!");
		    			window.location.href = "#/blog";
		    			reloadPage();
		    		}
		    	})
		    }
		});
		$.getJSON(App.api + "/blogpost/", function( results ){
			$.each( results, function( i, item ){
				var table = "";
				var arr = [];
				var slice = [];
				var input = item.Tags;

				// for (var i = 0; i < 5; i++) {
					for (var key in input) {
						if (input.hasOwnProperty(key)) {
							arr.push(key);
						}
					}
					var slice = arr.slice(0, 5);
					var string = slice.toString();
				// }
				console.log(arr);
				// var keyword = arr.toString();
				
				table += "<div class='card'>";
				table += "<h2>" + item.Title + "</h2>";
				table += "<small>" + item.DateCreated + "</small>";
				table += "<p>" + item.Author + "</p>";
				table += "<p>" + item.Content +"</p>";
				table += "<p><a href='#/blogdisplay/" + item.uid + 
				"'onClick='location.reload()'>See more >></a></p>";
				table += "<i>Tags: "+string+"</i>";
				table += "</div>";
				$('#output').append(table);
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
					localStorage.setItem("username", logUname);
					localStorage.setItem("status", 'loggedIn');
					window.location.href = "#/blog";
				}
			});
		});
	});

	Path.map("#/signup").to(function(){
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("signup", viewData));

		function calcAge(dob){
			var ageDifMs = Date.now() - dob.getTime();
			var ageDate = new Date(ageDifMs);
			return Math.abs(ageDate.getUTCFullYear() - 1970);
		}

		$("#myForms").submit(function(event){
			event.preventDefault();

			var empUname = $("#username").val();
			var empName = $("#name").val();
			var empCourse = $("#course").val();
			var empEmail = $("#email").val();
			var empPass = $("#password").val();
			var empRpass =$("#confirm-password").val();


			if (empName == "" || empCourse == "" || empEmail == ""
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
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("createblog"));
		$("#blog").submit(function(event){
			event.preventDefault();

			var blogTitle = $("#titleBlog").val();
			var blogContent = $("#contentBlog").val();
			var userLocal = localStorage.getItem("username");
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

	Path.map("#/blogdisplay/:id").to(function(){
		var uid = this.params['id'];
		var blogs = [];
		var response = getJSONDoc(App.api + "/blogdisplay/" + uid);
		var input = response.Tags;
		
		var blog = {
			title: response.title,
			content: response.content,
			author: response.author,
			dateCreated: response.dateCreated
		};
		blogs.push(blog);
		
		var viewData = {blog: blogs};

		var title = $("#titleBlog").val();
		var content = $("#contentBlog").val();
		var creator = $("#creatorBlog").val();

		$('#target').mustache('blogdisplay', viewData);
		var postCreator = response.author;
		// console.log(postCreator);

		// if (postCreator != userLocal) {
			// $("#commentsarea").show();
			// $("#commentsarea").removeAttr("hidden");
		// }else if (postCreator == userLocal) {
			// $("#commentsarea").hide();
		// }

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
		//});
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
				table += "<td><a href='#/blogdisplay/"+item.uid+
				"' onClick='reloadPage();'>Inspect Post</a></td>";
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
		});
	});

	Path.map("#/forget").to(function(){
		var viewData = {name: 'World'};
		$('#target').html("").append($.Mustache.render("forget,viewData"));
		window.location.reload();
	}).enter(clearPanel);

	Path.map("#/logout").to(function(){
		alert("Logging you out");
	    localStorage.removeItem("username");
	    window.location.href = "#/login";
	});

	Path.root("#/login");

	Path.rescue(function(){
		alert("404: Routhe Not Found");
	});

	Path.listen();
});