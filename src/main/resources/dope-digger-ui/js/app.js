var app = ( function () {
	var appModule = {},
		$doc = $( document ),
		ws;

		// fonly for UI visualisation
		var data = [
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas javascript ninjas"
					  },
					  {
						"topic": "Sed suscipit tempor eros id tincidunt. Nunc pharetra"
					  },
					  {
						"topic": "idea of denouncing pleasure and praising"
					  },
					  {
						"topic": "Integer iaculis pretium suscipit"
					  },
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas"
					  },
					  {
						"topic": "javascript ninjas"
					  }
					];

var userData = [
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  },
  {
    "name": "Batman Batmanov"
  }
];

	appModule.init = function() {
		var _this = this;

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

		function showApplicationContent( roomsData ) {
			var contentMarkup = '';

			contentMarkup += '<div class="container-fluid col-md-3">'
							+ '<div class="row user-profile-container">'
								+ '<aside class="column col-md-12">'
									+ '<header class="user-profile-section">'
										+ '<article>'
											+ '<img src="img/photo.jpg" class="img-responsive img-circle animated zoomIn user-image">'
										+ '</article>'
										+ '<h1 class="text-primary user-text">Batman</h1>'
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
									// + '<div class="msg-preview"><ul>' + generateChatRoomsTopicsMarkup( data ) + '<ul></div>'
								+ '</div>'
							+ '</div>'
							+ '<div class="row">'
								+ '<div class="col-md-12 msg-container"><ul class="msg-list">'
									// + generateChatRoomsMsgMarkup( dataMsg )
								+ '</ul></div>'
							+ '</div>'

							+ '<div class="row">'
								+ '<form role="form" class="col-md-12 ">'
									+ '<div class="form-group">'
										+ '<label for="comment"></label>'
										+ '<textarea class="form-control" rows="5" id="comment"></textarea>'
										+ ' <button type="submit" class="btn btn-default send-msg-btn">Send</button>'
									+ '</div>'
								+ '</form>'
							+ '</div>'
						+ '</div>'

						 + '<div class="users-right-sidebar container-fluid col-md-3 hidden">'
						 	+ '<h3 class="active-title">Active users</h3>'
						 	// + '<ul class="online-users-list">' + generateOnlineUsersList( userData ) + '</ul>'
						 + '</div>';

			return contentMarkup;
		}

		$doc.on( 'click', '.btn-fb-login', function( e ) {
			var $this = $( this ),
				appContentMarkup = '';

			$.ajax({
				method: "GET",
				url: "http://localhost:8080/rooms",
				//dataType: "application/json",
				success: function( roomsData ) {
					console.log( roomsData );
                    appContentMarkup = showApplicationContent( roomsData );
                    $( 'body' ).html( appContentMarkup );
				},
				error: function ( error ){
					console.log( error );
				}
			});
			// TODO: request to facebook api for log in and authentication

		});
	};

	appModule.joinChatRoom = function () {
		$doc.on( 'click','.join-btn', function ( e ) {
			var $this = $( this ),
				$currentRoom = $this.closest( '.chat-room-topic' ),
				$leaveBtn = $this.next( '.leave-btn' ),
				roomId = $this.parent().data( 'room-id' ),
				currentRoomTitle = $currentRoom.find( '.topic-holder' ).text();

			ws = $.gracefulWebSocket('ws://localhost:8080/ws-chat/'+ roomId +'?name=1');
			ws.onmessage = function (event) {
				console.log(event.data)
				var messageFromServer = event.data;
				$( '.msg-list' ).append( '<li>' + messageFromServer + '</li>' );
			};

			$( '.current-room' ).removeClass( 'hidden' );
			$( '.users-right-sidebar' ).removeClass( 'hidden' );
			$( '.room-topic' ).text( currentRoomTitle );

			if ( $currentRoom.hasClass( 'active-room' ) ) {
				$( '.chat-room-topic' ).removeClass( 'active-room' );
				$this.toggleClass( 'hidden' );
				$leaveBtn.toggleClass( 'hidden' );
			}
			else {
				$( '.chat-room-topic' ).removeClass( 'active-room' );
				$currentRoom.toggleClass( 'active-room' );
				$leaveBtn.toggleClass( 'hidden' );
				$this.toggleClass( 'hidden' );
			}

		});
	};

	appModule.leaveChatRoom = function () {
		$doc.on( 'click', '.leave-btn', function ( e ) {
			var $this = $( this ),
				$currentRoom = $this.closest( '.chat-room-topic' ),
				$joinBtn = $this.prev( '.join-btn' );

			$currentRoom.removeClass( 'active-room' );
			$this.toggleClass( 'hidden' );
			$joinBtn.toggleClass( 'hidden' );
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
			var msg = $( '#comment' ).val()
			ws.send(msg);

			console.log( 'send' );
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
	                url: "http://localhost:8080/room",
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
