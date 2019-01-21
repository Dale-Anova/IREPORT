var App = {
		api: "/sample/api/index.php"
}

function clearPanel(){
    		// You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.
    		//window.location.reload();
}

function reloadPage(){
	window.location.reload();
}

$.Mustache.options.warnOnMissingTemplates = true;
$.Mustache.load('template/template.html', function () {

			Path.map("#/blog").to(function(){
			    var viewData = { name: 'World' };
				//$('#target').mustache('blog', viewData);
				$('#target').html("").append($.Mustache.render("blog"));

				// $("#myForms").submit(function(event){
		  //         event.preventDefault();

				// var blogTitle	 = $("#post_title").val();
				// var blogContent	 = $("#post_content").val();

				// $.ajax({
				// 	method: "POST",
				// 	url: App.api + "/post/",
				// 	  //dataType: "script"
				// 	data: {
				// 		post_title: blogTitle,
				// 	  	post_content: blogContent,
				// 	},
				// 	success: function(data) {
				// 		if(parseInt(data.success) == 1) {
				// 	  		window.location.href = "#/blog";
				// 	  		reloadPage();
				// 	  	}
				// 	alert("Post created successfully");
				// 	$(location).attr('href', data);
				// 	  }
				// 	});	
				// });	
				$.getJSON(App.api + "/blogpost/", function( results ){
				$.each( results, function( i, item  ) {
					var table = "";
					table += "<div class='card'>";
					table += "<h2>"+item.Title+"</h2>";
					table += "<h5>"+item.DateCreated+"</h5> ";						
					table += "<p>"+item.Author+"</p> ";
					table += "<p>"+item.contentBlog+"</p>";	
					table += "</div>";										
				 	$("#blogposted tbody").append(table);
		 		});
			});

			Path.map("#/update").to(function(){
			    var viewData = { name: 'World' };
				//$('#target').mustache('blog', viewData);
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
					$(location).attr('href', data);
					  }
					});	
		      	});
			});


			Path.map("#/login").to(function(){
				var viewData = { name: 'World' };
			    $('#target').html("").append($.Mustache.render("login", viewData));
			    //$('#target').mustache('login', viewData);
			      
		        $("#myForms").submit(function(event){
		          event.preventDefault();

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
					  	// if(parseInt(data.success) == 1) {
					  	// 	alert('asdasdsa');
					  	// 	window.location.href = "#/blog";
					  	// 	reloadPage();
					  	// }
					  	localStorage.setItem('username',JSON.stringify(logUname));
					  	$(location).attr('href', data);
					  }
					});

		          //for retrieving object in local storage
		       //    for(var key in localStorage){
		       //    	var object = localStorage.getItem(key);
		       //    	var obj    = JSON.parse(object);

		       //    	if(obj["username"] == logUname && obj["password"] == logPass){
		       //    		//set session status to logged in
					    // // localStorage.setItem('status','loggedIn');
		       //    		$(location).attr('href', 'index.html#/blog');
		          		// window.location.reload();
		       //    	}else if(!(obj["username"] == logUname && obj["password"] == logPass)){
		       //    		alert('Username or Password is incorrect');
		       //    	}
		       //    }
		      	});
			});

			Path.map("#/signup").to(function(){
			    var viewData = { name: 'World' };
			    //$('#target').mustache('signup', viewData);
			    $('#target').html("").append($.Mustache.render("signup", viewData));

		        //function for age
		        function calcAge(dob) {
		          var ageDifMs = Date.now() - dob.getTime();
		          var ageDate = new Date(ageDifMs); // miliseconds from epoch
		          return Math.abs(ageDate.getUTCFullYear() - 1970);
		        }

		      //form submit function  
		        $("#myForms").submit(function(event){
		          event.preventDefault();

		          var empUname = $("#username").val();
		          var empName  = $("#name").val();
		          var empBday  = $("#bday").val();
		          var empEmail = $("#email").val();
		          var empPass  = $("#psw").val();
		          var empRpass = $("#psw-repeat").val();
		          // var userObj  = $({ "username": empUname, "name": empName,
		          // "age": calcAge(new Date(empBday)), "birthday": empBday, "email": empEmail, 
		          // "password": empPass});

		          // $( "body" ).data( empUname, { "username": empUname, "name": empName,
		          // "age": calcAge(new Date(empBday)), "birthday": empBday, "email": empEmail, 
		          // "password": empPass});

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
					  url: App.api + "/signup/",
					  dataType: "json",
					  data: {
					  	username: empUname,
					  	name: empName,
					  	birthday: empBday,
					  	email: empEmail,
					  	password: empPass
					  },
					  success: function(data) {
					  	// console.log(data);
					  	alert('User Succesfully Added');
					  	//$(location).attr('href', data);
					  	//window.location.reload();
					  	if(parseInt(data.success) === 1) {
					  		window.location.href = "#/login";
					  		reloadPage();
					  	}
					  }
					});

		          //storing values on local storage
		          // localStorage.setItem(empUname, JSON.stringify({ "username": empUname, "name": empName,
		          // "age": calcAge(new Date(empBday)), "birthday": empBday, "email": empEmail, 
		          // "password": empPass}));
		          // localStorage.setItem("username", empUname);

		          // console.log($( "body" ).data());
		          

		          //redirect to login
		          // $(location).attr('href', 'api/index.php/signup/');
		          // window.location.reload();
		        });
		    	
			});

			Path.map("#/createblog").to(function(){
			    var viewData = { name: 'World' };
				//$('#target').mustache('blog', viewData);
				$('#target').html("").append($.Mustache.render("createblog"));

				$("#blog").submit(function(event){
		          event.preventDefault();

				var blogTitle	 = $("#titleBlog").val();
				var blogContent	 = $("#contentBlog").val();
				var userLocal 	 = localStorage.getItem("username");
				console.log(userLocal);

				if(blogTitle === "")
		 		{
		 			blogTitle = "Untitled";
		 		}

		 		if(blogContent === "")
		 		{
		 			alert("You haven't inputted something");
		 			return false;
		 		}
		 		else
		 		{
				$.ajax({
					method: "POST",
					url: App.api + "/post/",
					  //dataType: "script"
					data: {
						post_title: blogTitle,
					  	post_content: blogContent,
					  	creator: userLocal
					},
					success: function(data) {
						if(parseInt(data.success) == 1) {
					  		window.location.href = "#/blog";
					  		reloadPage();
					  	}
					alert("Post created successfully");
					$(location).attr('href', data);
					  }
					});
					}	
				});	
			});

			Path.map("#/forget").to(function(){
			    var viewData = { name: 'World' };
			    //$('#target').mustache('forget', viewData);
			    $('#target').html("").append($.Mustache.render("forget", viewData));
			    window.location.reload();
			}).enter(clearPanel);

			Path.root("#/signup");

			Path.listen();

		});