function reloadPage(){
	window.location.reload();
}
var App = {
	target: $("#target"),
	api: "/web/api/index.php"
}

var author = localStorage.getItem("Author");
var userLocal =  localStorage.getItem("username");
	$(".commentsarea").hide();	

function commentArea() {
	if(author != userLocal)	{
		$(".commentsarea").show();
		$(".commentsarea").removeAttr("hidden");
	}else if(author == userLocal) {
		$(".commentsarea").hide();
	}
}


$.Mustache.options.warnOnMissingTemplates = true;
$.Mustache.load('../template/template.html', function () {

	Path.map("#/signup").to(function(){
		$('#target').html("").append($.Mustache.render("signup"));
		
		// console.log(window.location.origin + window.location.pathname + "#/login"); 

		$("#myForms").submit(function(event){
		    event.preventDefault();

		  var empUname = $("#username").val();
          var empName  = $("#name").val();
          var empBday  = $("#birthday").val();
          var empEmail = $("#email").val();
          var empPass  = $("#password").val();
          var empRpass = $("#confirm_pass").val();

          function calcAge(dob) {
		        var ageDifMs = Date.now() - dob.getTime();
		        var ageDate = new Date(ageDifMs); // miliseconds from epoch
		        return Math.abs(ageDate.getUTCFullYear() - 1970);
		    }

          $( "body" ).data( empUname, { "username": empUname, "fullname": empName,
          "age": calcAge(new Date(empBday)), "birthday": empBday, "email": empEmail, 
          "password": empPass});

          if(empName == "" || empBday == "" || empEmail == "" || empUname == "" ||
            empPass == "" || empRpass == "")
          {
            alert("Please fill out all fields");
            return false;
          }

          if (empRpass !== empPass) {
            alert("Password Mismatch")
            return false;
          }


          $.ajax({
			method: "POST",
			url:  App.api +"/signup/",
			// dataType: "json",
			data: {
			  	username: empUname,
			  	fullname: empName,
			  	birthday: empBday,
			  	email: empEmail,
			  	password: empPass
				  },
				  success: function(data) {
				  	alert('User Succesfully Added');
				  	window.location.href = "#/login";
				  	console.log(data);
				  }
				});

          //storing values on local storage
          localStorage.setItem(empUname, JSON.stringify({ "username": empUname, "fullname": empName,
          "age": calcAge(new Date(empBday)), "birthday": empBday, "email": empEmail, 
          "password": empPass}));
		});
	});

	Path.map("#/login").to(function(){
		$('#target').html("").append($.Mustache.render("login"));
		$("#myForms").submit(function(event){
		    event.preventDefault();

		  var counter = 0;  
          var logUname = $("#username").val();
          var logPass  = $("#password").val();

          if(logUname == "" || logPass == "" )
          {
            alert("Please fill out all fields");
            return false;
          }

		$.ajax({
		  method: "POST",
		  url: App.api + "/login/",
		  //dataType: "script"
		  data: {
		  	username: logUname,
		  	password: logPass
		  },
		  success: function(data) {
		  	if(parseInt(data) == 1) {
		  		alert('Succesfully login!');
				localStorage.setItem("username", JSON.stringify(logUname));
			 	window.location.href = "#/homepage";
		  	}else {
				alert('No Username or Password found!');
				return false;
		  	}
		}
		});        
        });
	});

	Path.map("#/blog").to(function(){
		$('#target').html("").append($.Mustache.render("blog"));
		$("#post").submit(function(event){
		    event.preventDefault();
		    var blogTitle   = $("#blog_title").val();
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
		    			window.location.href = "#/homepage";
		    			reloadPage();
		    		}
		    	})
		    }
		});
	});

	Path.map("#/homepage").to(function(){
		$('#target').html("").append($.Mustache.render("homepage"));

		$("#post").submit(function(event){
		    event.preventDefault();
		    var blogTitle   = $("#blog_title").val();
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
		    			// window.location.href = "#/homepage";
		    			reloadPage();
		    		}
		    	})
		    }
		});

		$("#logout").click(function(){
			window.location.href = "#/logout";
		});

		$("#myblogs").click(function(){
			window.location.href = "#/displayuserblog";
		});

		$("#viewprofile").click(function(){
			window.location.href = "#/viewuserprofile";
		});
		// $.getJSON(App.api + "/blogdisplay/" + uid, function(){
		// 	var template = $.Mustache.render('blogdisplay').html("");
		// 	var html = Mustache.to_html(template, viewData);
		// 	$('#blogContent').html(html);
		// });
		var blogCreator = localStorage.getItem("username");
		$.getJSON(App.api + "/blogpost/", function( results ){
				// console.log(results);
			$.each( results, function( i, item  ) {
				var table = "";
				table += "<tr>"
				table += "<th scope='row' class='list'>"+item.Title+"</th>";
				table += "<td class='list'>"+item.Author+"</td>";
				table += "<td class='content'>"+item.Content+"</td>";
				table += "<td class='date'>"+item.DateCreated+"</td>";
				table += "<td class='list'>"+item.DateModified+"</td>";
				table += "<td><a href=#/blogdisplay/"+item.uid+
				" onClick='location.reload()'>See more</a></td>";
				if (blogCreator == item.Author) {
					table += " | <td><a href=#/updateblog/"+item.uid+" onClick='location.reload()'>Update</a></td></tr> ";
				}else {
					table += "<td>Not Your Post!</td></tr>"
				}

					$("#blogposted tbody").append(table);		
					// $("table > tbody > tr").hide().slice(0, 5).show();
					// $('table tr:gt(1)').hide();
					// // makeTableScroll();
		 	});
		 	// $(document).ready(function(){
		 	$('#blogposted').dataTable({
		 			"pageLength": 5,
		 			"lengthChange": false,
		 			"order": [[ 3, "desc" ]],
		 			
		 		});
		 	// });
		});
	});

	Path.map("#/update").to(function(){
		$('#target').html("").append($.Mustache.render("update"));
		$("#myForms").submit(function(event){
		    event.preventDefault();

		    var bOldUsername = $("#oldUsername").val();
			var bName 		 = $("#name").val();
			var bBirthday 	 = $("#birthday").val();
			var bEmail 		 = $("#email").val();
			var bPassword 	 = $("#password").val();

			$.ajax({
				method: "POST",
				url: App.api + "/update/",
				  //dataType: "script"
				data: {
					username: bOldUsername,
				  	name: bName,
				  	birthday: bBirthday,
				  	email: bEmail,
				  	password: bPassword
					},
				success: function(data) {
					alert("Record updated successfully");
					// $(location).attr('href', data);
					window.location.href = "#/blog";
				  }
				});	
		});
	});

	Path.map("#/blogdisplay/:id").to(function(){
		var uid = this.params['id'];
		
		var blogs = [];
		var response = getJSONDoc(App.api + "/blogdisplay/" + uid);
		var blog = {
			title: response.title,
			content: response.content,
		 	author: response.author,
		 	dateCreated: response.dateCreated
		};	
		blogs.push(blog);
		var postCreator = response.author;
		var viewData = {
			blog: blogs
		};								
		// console.log(postCreator);
		// $.getJSON(App.api + "/blogdisplay/" + uid, function(){
		// 	var template = $.Mustache.render('blogdisplay').html("");
		// 	var html = Mustache.to_html(template, viewData);
		// 	$('#blogContent').html(html);
		// });

		var author = localStorage.getItem("username");
		// function showButton(){
		// if (author == postCreator) {
		// 	// funcDiv.style.visibility == 'visible';
		// 	$(".functional").removeAttr("hidden");
		// 	$(".functional").show();
			// console.log(author);
		// }

		var title = $("#titleBlog").val();
		var content = $("#contentBlog").val();
		var creator = $("#creatorBlog").val();
		var data;

		$('#target').mustache('blogdisplay', viewData);
		commentArea();
			// showButton();

		$("#backHome").click(function(){
			window.location.href = "#/homepage";
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
					        return true;
					    }
			  		}
				});
				}
		   });
		
		});

	Path.map("#/updateblog/:id").to(function(){
		var uid = this.params['id'];
		$('#target').html("").append($.Mustache.render("updatebloguser"));
		var userLocal = localStorage.getItem("username");
		// console.log(userLocal);
		
		$("#homepage").click(function(){
			window.location.href = "#/homepage";
		});
		$("#logout").click(function(){
			window.location.href = "#/logout";
		});

		$.getJSON(App.api + "/updateblog/" + uid, function( response ) {
		$("#uidBlog").val(response.uid);
		$("#titleBlog").val(response.title);
		$("#contentBlog").val(response.content);
		});

		$("#blogviewing").submit(function(e){
	 		e.preventDefault();

	 		var uid = $("#uidBlog").val();
	 		var title = $("#titleBlog").val();
			var content = $("#contentBlog").val();

			$.ajax({
		  		method: "POST",
		  		url: App.api  + "/updateblog",
		  		dataType: "json",
		  		data : {
		  			uid : uid,
		  			title : title,
		  			content : content,
		  			author : userLocal
		  		},
		  		success:function(response){
		  			if(parseInt(response.success) == 1){
				        alert("Blog Successfully Updated");
				        window.location.href = "#/homepage";
				    }
		  		}
			});
		});

		$(function(){	
			$("#blogdelete").on("click", function(){
		 		// e.preventDefault();
		 		var uid = $("#uidBlog").val();
		 	
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
					        window.location.href = "#/homepage";
					    }
			  		}
				}); 		
		    });
		});
	});

	Path.map("#/viewuserprofile").to(function(){
		$('#target').html("").append($.Mustache.render("viewuserprofile"));

		$("#homepage").click(function(){
			window.location.href = "#/homepage";
		});
		
		$("#logout").click(function(){
			window.location.href = "#/logout";
		});

		$("#myblogs").click(function(){
			window.location.href = "#/displayuserblog"
		});
			var userLocal = localStorage.getItem("username");
			// console.log(userLocal);
			$.getJSON(App.api + "/profile/" + userLocal, function( response ) {
				// $("#dispUsername").val(response.username);
				// $("#dispFullname").val(response.fullname);
				// $("#dispUid").val(response.uid);
				// $("#dispBirthday").val(response.birthday);
				// $("#dispEmail").val(response.email);
				let html ="";
				html += "<h1>"+response.username+"</h1>";
				html += "<h3> Full Name: "+response.fullname+"</h3>";
				html += "<h3> User ID: "+response.uid+"</h3>";
				html += "<h5> Birthday: "+response.birthday+"</h5>";
				html += "<h5> Email: "+response.email+"</h5>";

				$("#userprofile").append(html);
			});
				
		});

	Path.map("#/displayuserblog").to(function(){
		$('#target').html("").append($.Mustache.render("displayuserblog"));

		var userLocal = localStorage.getItem("username");
		$("#logout").click(function(){
			window.location.href = "#/logout";
		});

		$("#homepage").click(function(){
			window.location.href = "#/homepage";
		});

		$.getJSON(App.api + "/allblogs/" + userLocal, function( results ){
			$.each( results, function( i, item  ) {	
			 	let html ="";
			 	html += "<div class='card'>";
			 	html += "<h1>Title: "+item.Title+"</h1>";
			 	html += "<h2>Content: "+item.Content+"</h2>";
			 	html += "<h6>Date Created: "+item.DateCreated+"</h6>";
			 	html += "<h6>Date Modified: "+item.DateModified+"</h6>";
			 	html += "<a href=#/updateblog/"+item.uid+">Update</a>";
			 	$("#blogpostedbyuser").append(html);
	 		});	  
		});

		$.getJSON(App.api + "/deletedblogs/" + userLocal, function( results ){
			$.each( results, function( i, item  ) {
				let html ="";
			 	html += "<div class='card'>";
			 	html += "<h1>Title: "+item.Title+"</h1>";
			 	html += "<h2>Content: "+item.Content+"</h2>";
			 	html += "<h6>Date Deleted: "+item.DateDeleted+"</h6>";
			 	html += "</div>";
			 	$("#blogdeletedbyuser").append(html);
			 });
		});	
	});

	Path.map("#/logout").to(function(){
		alert("Logged out");
	   	localStorage.removeItem("username");
	   	localStorage.removeItem("status");
	   	window.location.href = "#/login";
	});

	Path.root("#/signup");

	Path.listen();
});