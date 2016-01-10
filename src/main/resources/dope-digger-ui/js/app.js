var app = ( function () {
	var appModule = {},
		$doc = $( document ),
		ws,
		currentUserId;

	appModule.init = function() {
		var _this = this;


		window.fbAsyncInit = function() {
			FB.init({
				appId      : 1084358888283500,
				cookie     : true,  // enable cookies to allow the server to access
									// the session
				xfbml      : true,  // parse social plugins on this page
				version    : 'v2.2' // use version 2.2
			});

			// Now that we've initialized the JavaScript SDK, we call
			// FB.getLoginStatus().  This function gets the state of the
			// person visiting this page and can return one of three states to
			// the callback you provide.  They can be:
			//
			// 1. Logged into your app ('connected')
			// 2. Logged into Facebook, but not your app ('not_authorized')
			// 3. Not logged into Facebook and can't tell if they are logged into
			//    your app or not.
			//
			// These three cases are handled in the callback function.

			//FB.getLoginStatus(function(response) {
			//	statusChangeCallback(response);
			//});

		};

		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		_this.logInWithFacebook();
		_this.viewUserProfile();
		_this.joinChatRoom();
		_this.leaveChatRoom();
        _this.createNewRoom();
        _this.sendNewMsg();

	};

	appModule.logInWithFacebook = function() {
		// scope helper functions
		function generateChatRoomsMsgMarkup( arrayOfTopics ) {
			var markup = '';

			for ( var i = 0; i < arrayOfTopics.length; i++ ) {
				markup += '<li class="row chat-room-msg">' + arrayOfTopics[ i ].msg
						+ '</li>'
			}

			return markup;
		}

		function generateChatRoomsTopicsMarkup( arrayOfTopics ) {
			var markup = '';

			for ( var i = 0; i < arrayOfTopics.length; i++ ) {
				markup += '<li class="row chat-room-topic" data-room-id="' + arrayOfTopics[ i ].id + '">' + '<span class="topic-holder col-md-8 col-xs-8">' + arrayOfTopics[ i ].topic + '</span>'
							+ '<a class="join-btn col-md-2 col-xs-2">Join</a>'
							+ '<a class="leave-btn col-md-2 col-xs-2 hidden">Leave</a>'
							+ '<a class="edit-room-btn col-md-2 col-xs-2"><i class="fa fa-cogs"></i></a>'
						+ '</li>'
			}

			return markup;
		}

		function generateOnlineUsersList( arrayOfUsers ) {
			var markup = '';

			for ( var i = 0; i < arrayOfUsers.length; i++ ) {
				markup += '<li class="row chat-room-topic">'
							+ '<img class="online-user-img img-circle img-responsive col-md-2 col-xs-2" src="img/batman-online.jpg" />'
							+ '<span class="online-user-name col-md-8 col-xs-8">' + arrayOfUsers[ i ].name + '</span>'
						+ '</li>'
			}

			return markup;
		}

		function showApplicationContent( roomsData, userData, profilePicUrl ) {
			var contentMarkup = '';

			contentMarkup += '<div class="container-fluid col-md-3">'
							+ '<div class="row user-profile-container">'
								+ '<aside class="column col-md-12">'
									+ '<header class="user-profile-section" data-user-id="'+userData.id+'">'
										+ '<article>'
											+ '<img src="'+profilePicUrl+'" class="img-responsive img-circle animated zoomIn user-image">'
										+ '</article>'
										+ '<h1 class="text-primary user-text">'+userData.name+'</h1>'
										+ '<h2 class="user-info">javaScript Developer</h2>'
									+ '</header>'
								+ '<nav>'
									+ '<ul class="pager">'
										+ '<li>'
											+ '<a href="#" title="View" class="animated rotateIn view-user-profile"><i class="fa fa-hand-o-up"></i></a>'
										+ '</li>'
									+ '</ul>'
								+ '</nav>'
								+ '</aside>'
							+ '</div>'
							+ '<div class="row room-topics">'
								+ '<div class="add-new-room-btn col-md-12 col-xs-12 text-center"><i class="fa fa-users"></i>Create new room</div>'
                                + '<div class="new-room-name hidden"><label for="room-name">New room:</label><input type="text" class="form-control new-room-name-input" id="room-name"></div>'
								+ '<ul class="col-md-12 topics-list">'
									+ generateChatRoomsTopicsMarkup( roomsData )
								+ '</ul>'
							+ '</div>'
						+ '</div>'

						+ '<div class="current-room container-fluid col-md-6 hidden">'
							+ '<div class="row">'
								+ '<div class="col-md-12">'
									+ '<h2 class="room-topic"></h2>'

								+ '</div>'
							+ '</div>'
							+ '<div class="row">'
								+ '<div class="col-md-12 msg-container">'
									+'<ul class="msg-list">'
									+ '</ul>'
								+'</div>'
							+ '</div>'

							+ '<div class="row">'
								+ '<form role="form" class="msg-form col-md-12 ">'
									+ '<div class="form-group">'
										+ '<label for="comment"></label>'
										+ '<textarea class="form-control textarea-msg" rows="5" id="comment"></textarea>'
										+ ' <button type="submit" class="btn btn-default send-msg-btn">Send</button>'
									+ '</div>'
								+ '</form>'
							+ '</div>'
						+ '</div>'

						 + '<div class="users-right-sidebar container-fluid col-md-offset-1 col-md-2 hidden">'
						 	// + '<h3 class="active-title">Some sidebar right? </h3>'
						 	+ '<ul class="online-users-list">'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 		// + '<li><i class="fa fa-smile-o"></i></li>'
						 	+ '</ul>'
						 + '</div>';

			return contentMarkup;
		}

		$doc.on( 'click', '.btn-fb-login', function( e ) {
			var $this = $( this ),
				appContentMarkup = '';

			function loadProiflePic(roomsData, userId, userData){
				FB.api(
					"/"+ userId + "/picture?height=200&width=200",
					function (response) {
						if (response && !response.error) {
							appContentMarkup = showApplicationContent( roomsData, userData, response.data.url );
							$( 'body' ).html( appContentMarkup );
						}
					}
				);
			}

			function buildUserProifle(userData){
				FB.api(
					"/"+ userData.id + "/picture",
					function (response) {
						if (response && !response.error) {
							var newUserProfile = {
								id: userData.id,
								name: userData.name,
								profilePicture: response.data.url
							};

							$.ajax({
								method: "POST",
								url: "user",
								contentType: "application/json",
								data: JSON.stringify( newUserProfile ),
								success: function( userProfile ) {
									console.log( userProfile );
								},
								error: function ( error ){
									console.log( error );
								}
							});

						}
					}
				);
			}

			// Here we run a very simple test of the Graph API after login is
			// successful.  See statusChangeCallback() for when this call is made.
			function getUserData() {
				FB.api('/me', function(response) {
					currentUserId = response.id;

					$.ajax({
						method: "GET",
						url: "rooms",
						success: function( roomsData ) {
							loadProiflePic(roomsData, response.id, response);
							buildUserProifle(response);
						},
						error: function ( error ){
							console.log( error );
						}
					});

				});
			}
			// TODO: request to facebook api for log in and authentication
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					console.log('Logged in.');
					getUserData()
				}
				else {
					FB.login();
				}
			});
		});


	};

	appModule.joinChatRoom = function () {
		$doc.on( 'click','.join-btn', function ( e ) {
			if (typeof currentUserId !== 'undefined') {
				var $this = $(this),
					$currentRoom = $this.closest('.chat-room-topic'),
					$leaveBtn = $this.next('.leave-btn'),
					roomId = $this.parent().data('room-id'),
					currentRoomTitle = $currentRoom.find('.topic-holder').text();

				var protocol = 'ws://';
				if (location.protocol == "https:"){
					protocol = 'wss://'
				}
				ws = $.gracefulWebSocket(protocol + location.host + '/ws-chat/' + roomId + '?name=' + currentUserId);
				ws.onmessage = function (event) {
					var messageFromServer = event.data,
						jsonMessageFromServer = JSON.parse(messageFromServer);

					if (JSON.parse(messageFromServer).type == 'system') {
						var systemActionText = jsonMessageFromServer.data.action,
							systemUser = jsonMessageFromServer.data.user.name;

						$('.msg-list').append('<li class="system-information-msg">' + systemUser + ' ' + systemActionText + '</li>');

						if ( JSON.parse(messageFromServer).data.action == 'LEFT' ) {
							var $liToRemove = $( '.online-users-list' ).find( "[data-user-id='" + currentUserId + "']" );

							$( '.online-users-list' ).remove( $liToRemove );
						}

						if ( JSON.parse(messageFromServer).data.action == 'JOINED' ) {
							var $liToAdd = $( '<li data-user-id="'+ currentUserId +'"><img class="img-circle current-user-pic" src="' + JSON.parse(messageFromServer).data.user.profilePicture + '"/>' + '<span class="current-online-user">' + JSON.parse(messageFromServer).data.user.name + '</span></li>' );

							$( '.online-users-list' ).append( $liToAdd );
						}
					}
					else {
						var messagetext = JSON.parse(messageFromServer).data.content,
							messageAuthor = JSON.parse(messageFromServer).data.author.name,
							authorImgUril = JSON.parse(messageFromServer).data.author.profilePicture,
							messageSendDate = JSON.parse(messageFromServer).data.date;

						var msgStringMarkup = '<li class="msg-content">'
							+ '<div class="comment-cont">'
								+ '<img class="author-img img-circle" src="' + authorImgUril + '" />'
								+ '<p class="author-comment">' + '<i class="fa fa-share quote"></i>' + messagetext + '</p>'
							+ '</div>'
							+ '<p class="msg-date">' + messageAuthor + '</p>'
							+ '<span class="msg-date">' + moment(messageSendDate).format('DD MMM YYYY HH:mm') + '</span>'
							+ '</li>';

						$('.msg-list').append(msgStringMarkup);
					}
				};

				$.ajax({
					method: "GET",
					url: "room/" + roomId,
					contentType: "application/json",
					success: function( data ) {
						for  ( var i = 0; i < data.length; i++ ) {
							$( '.online-users-list' ).append( '<li data-user-id="' + data[ i ].id +'">' + data[ i ].profilePicture + data[ i ].name );
						};

					},
					error: function ( error ){
						console.log( error );
					}
				});

				$('.current-room').removeClass('hidden');
				$('.users-right-sidebar').removeClass('hidden');
				$('.room-topic').text(currentRoomTitle);

				if ($currentRoom.hasClass('active-room')) {
					$('.chat-room-topic').removeClass('active-room');
					$this.toggleClass('hidden');
					$leaveBtn.toggleClass('hidden');
				}
				else {
					$('.chat-room-topic').removeClass('active-room');
					$currentRoom.toggleClass('active-room');
					$leaveBtn.toggleClass('hidden');
					$this.toggleClass('hidden');
				}
			}

		});
	};

	appModule.leaveChatRoom = function () {
		$doc.on( 'click', '.leave-btn', function ( e ) {
			var $this = $( this ),
				$currentRoom = $this.closest( '.chat-room-topic' ),
				$joinBtn = $this.prev( '.join-btn' );

			$currentRoom.removeClass( 'active-room' );
			$( '.current-room' ).addClass( 'hidden' );
			$('.msg-list').html( '' );
			$( '.users-right-sidebar' ).addClass( 'hidden' );
			$this.toggleClass( 'hidden' );
			$joinBtn.toggleClass( 'hidden' );

			// close web socket
			ws.close();
		});
	};

	appModule.viewUserProfile = function () {
		$doc.on( 'click', '.view-user-profile', function ( e ) {
			console.log( 'batman' );
		});
	};

	appModule.sendNewMsg = function () {
		$doc.on( 'click', '.send-msg-btn', function ( e ) {
			e.preventDefault();

			var msg = $( '#comment' ).val();
			ws.send(msg);

			$( '#comment' ).val( '' );
		});
	}

    appModule.createNewRoom = function() {
        var counterId = 4;

        function singleRoomMarkup ( id, roomName ) {
            var markup = '';

            markup += '<li class="row chat-room-topic" data-room-id="' + id + '">' + '<span class="topic-holder col-md-8 col-xs-8">' + roomName + '</span>'
                + '<a class="join-btn col-md-2 col-xs-2">Join</a>'
                + '<a class="leave-btn col-md-2 col-xs-2 hidden">Leave</a>'
                + '<a class="edit-room-btn col-md-2 col-xs-2"><i class="fa fa-cogs"></i></a>'
                + '</li>';

            return markup;
        }

        $doc.on( 'click', '.add-new-room-btn', function( e ) {
            $( '.new-room-name').removeClass( 'hidden' );
            $( '.new-room-name-input' ).val( '' );
      });

        $doc.on( 'blur', '.new-room-name-input', function ( e ) {
           var $this = $( this),
               newRoomName = $this.val(),
               newRoomObject = {};

            newRoomObject = {
                id: counterId += 1,
                topic: newRoomName
            };

            $( '.new-room-name').addClass( 'hidden' );
            console.log(newRoomObject);

            if ( newRoomObject.topic !== '' ) {
	            $.ajax({
	                method: "POST",
	                url: "room",
	                contentType: "application/json",
	                data: JSON.stringify( newRoomObject ),
	                success: function( success ) {
	                    var addedNewRoomMarkup = singleRoomMarkup(newRoomObject.id, newRoomObject.topic );

	                    $( '.topics-list').prepend( addedNewRoomMarkup );
	                },
	                error: function ( error ){
	                    console.log( error );
	                }
	            });
	        }
        });

    };

	return appModule;
})( app || {} );

app.init();
