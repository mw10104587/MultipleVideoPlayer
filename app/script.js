/* script.js */

// Input Controller
const IC = {
	/**
	set up canvas and listener 
	*/
	init: function(){

		console.log('Init canvas settings...');

		this.canvas = document.getElementById("canvas-wrap").querySelector("canvas");
		this.canvas.width  = screen.width;
		this.canvas.height = screen.height;

		this.canvas.addEventListener("mousedown", function(e){
			mouseDownEvent(e.clientX, e.clientY);
		});

		document.getElementById("tutorial-overlay").addEventListener("click", function(){
			this.style.opacity = 0;
			this.style.zIndex = 999;
		});

	},
	inSubUI: false,
	subUI: null,
	
	FOCUS_GESTURES: ["all", "all2", "arrow"],
	SINGLE_OP_GESTURES: ["play", "delete", "pause", "mute", "triangle"],
	SUBUI_GESTURES: ["size", "volume", "volume2","playbackSpeed", "seek"],
	VALUE_SELECTION_GESTURES: ["up", "down"],
	showQuestion: function() {

		const questionOverlay = document.getElementById("tutorial-overlay");
		let opacity = 0.1;
		let showQuestionToken = setInterval(function(){
			if ( opacity > 1) {

				clearInterval(showQuestionToken);
				questionOverlay.style.zIndex = 1001;
				return;
			
			} else {
				questionOverlay.style.opacity = opacity;
				opacity += 0.1;
			}
			
		}, 50)
		

	},
	showSelectUIHint: function(){
		const hints = document.getElementsByClassName("hint-wrap");
		Array.prototype.forEach.call( hints, function(hintWrap){
			if ( hintWrap.id === "selectui-wrap" || hintWrap.id === "single-op-wrap" ) {
				hintWrap.style.opacity = 1;
			} else {
				hintWrap.style.opacity = 0;
			}
		});
	},
	showSubUIHint: function(){
		const hints = document.getElementsByClassName("hint-wrap");
		Array.prototype.forEach.call( hints, function( hintWrap ) {

			if ( hintWrap.id === "subui-wrap" || hintWrap.id === "single-op-wrap" ) {
				hintWrap.style.opacity = 1;
			} else {
				hintWrap.style.opacity = 0;
			}
		});
	},
	showValueSelectionHint: function(){
		const hints = document.getElementsByClassName("hint-wrap");
		Array.prototype.forEach.call( hints, function( hintWrap ) {

			if ( hintWrap.id === "numeric-ui-wrap" || hintWrap.id === "single-op-wrap" ) {
				hintWrap.style.opacity = 1;
			} else {
				hintWrap.style.opacity = 0;
			}

		});

	},
	clearSubUI: function(){

		this.inSubUI = false;
		this.subUI = null;
	
	},
	arrow: function(){

		if ( VC.videos.length === 0 ){
			// nothing should happen
			drawText("Please add a video first");
			return;
		}

		if ( !VC.hasFocusVideo() ){
			
			drawText("Now you can control the first video");

			// focus on the first one
			VC._highlightVideo(VC.videos[0].id);

			// put the first video into the current focus queue.
			VC.currentFocusVideos.push(VC.videos[0]);


		} else {
				
			if ( VC.currentFocusVideos.length > 1 ) {

				drawText("Now you can control the first video");
				// remove all focus
				VC.currentFocusVideos.length = 0;

				// only focus the first one
				VC._highlightVideo( VC.videos[0].id );
				VC.currentFocusVideos.push(VC.videos[0]);

			} else if ( VC.currentFocusVideos.length === 1 ) {

				// move to the next one
				// find the current highlighted in the videos list and move to the next one and highlight it
				const currentFocusIndex = VC.videos.findIndex( (a) => (a.id === VC.currentFocusVideos[0].id ));
				if ( currentFocusIndex + 1 >= VC.videos.length ) {
					// go back to the first video
					drawText("Now you can control the first video");

					VC.currentFocusVideos = [VC.videos[0]];
					VC._highlightVideo( VC.videos[0].id );
					return;

				}

				drawText(`Now you can control video number ${currentFocusIndex + 2}`);

				VC.currentFocusVideos.splice(0, 1);
				VC.currentFocusVideos.push(VC.videos[currentFocusIndex + 1]);

				// unfocus others
				VC._unhighlightVideo( VC.videos[currentFocusIndex].id );

				// focus the next 
				VC._highlightVideo( VC.videos[currentFocusIndex + 1].id );

			} else {
				// probably won't be in here
				console.log('SHOULDNT BE IN HERE...');
			}
		}

	},
	all: function(){
		

		drawText("Now you can control all the videos");

		// remove everything from currentFocusVideos
		VC._clearCurrentFocusVideos();

		for ( var i = 0; i < VC.videos.length; i++ ) {
			// add all of the videos into  current focus...
			VC.currentFocusVideos.push(VC.videos[i]);

			// focus it
			VC._highlightVideo(VC.videos[i].id);
		}
	},
	play: function(){

		let focusVideoText = "one";
		if ( VC.currentFocusVideos.length > 1 ) focusVideoText = "all";
		drawText(`Played ${focusVideoText} video.`);

		// play all the video that's currently in the focus
		VC.currentFocusVideos.forEach(function( videoObject ){
			VC._playVideo(videoObject.id);
		});

		// VC._clearCurrentFocusVideos();
	},
	delete: function(){

		let focusVideoText = "one";
		if ( VC.currentFocusVideos.length > 1 ) focusVideoText = "all";

		drawText(`Deleted ${focusVideoText} video.`);

		for (let i = VC.currentFocusVideos.length-1; i > -1; i--) {
			const videoObject = VC.currentFocusVideos[i];
			VC._removeVideo(videoObject.id);
		}

		VC._clearCurrentFocusVideos();
	},
	pause: function(){

		let focusVideoText = "one";
		if ( VC.currentFocusVideos.length > 1 ) focusVideoText = "all";
		drawText(`Paused ${focusVideoText} video.`);

		VC.currentFocusVideos.forEach(function( videoObject ){
			VC._pauseVideo(videoObject.id);
		});

		// VC._clearCurrentFocusVideos();
	}, 
	mute: function(){
		let focusVideoText = "one";
		if (VC.currentFocusVideos.length > 1) focusVideoText = "all";
		drawText(`Muted ${focusVideoText} video`);

		VC.currentFocusVideos.forEach(function( videoObject ){
			VC._muteVideo( videoObject.id );
		});

	},
	/******* Sub UI functions ********/
	// These gesture would activate the up and down listener...
	activateSize: function(){
		// this function would only be called when the user drew a star

		drawText("Now you can control the size of the selected video");
		this.inSubUI = true;
		this.subUI = "size";

	},
	resize: function( up ){
		VC.currentFocusVideos.forEach(function( videoObject ){
			VC._setVideoSize(videoObject.id, up);
		});
	},
	activateVolume: function(){

		drawText("Now you can control the volume of the selected video");
		this.inSubUI = true;
		this.subUI = "volume";
		console.log('[SubUI] volume listening...');
	},
	volume: function( up ){

		let focusVideoText = "one";
		if ( VC.currentFocusVideos.length > 1 ) focusVideoText = "all";
		drawText(`Set volume for ${focusVideoText} video.`);

		VC.currentFocusVideos.forEach(function( videoObject ){
			VC._setVideoVolume(videoObject.id, up);
		});
	},
	activatePlaybackSpeed: function(){

		drawText("Now you can control the playback speed of the selected video");
		this.inSubUI = true;
		this.subUI = "playbackSpeed";
		console.log('[SubUI] playbackSpeed listening...');
	},
	playbackSpeed: function(up){

		let focusVideoText = "one";
		if ( VC.currentFocusVideos.length > 1 ) focusVideoText = "all";
		drawText(`Set speed for ${focusVideoText} video.`);

		VC.currentFocusVideos.forEach(function( videoObject ){
			VC._setVideoPlaybackSpeed(videoObject.id, up);
		});
	},
	activateSeek: function(){
		
		drawText("Now you can control the current display time of the selected video");
		this.inSubUI = true;
		this.subUI = "seek";
		console.log('[SubUI] seek listening...');
	},
	seek: function( up ) {

		let focusVideoText = "one";
		if ( VC.currentFocusVideos.length > 1 ) focusVideoText = "all";
		drawText(`Set current playing time for ${focusVideoText} video.`);

		VC.currentFocusVideos.forEach(function(videoObject){
			VC._setVideoSeek(videoObject.id, up);
		});
	}

};

// Video Controller
const VC = {
	// id, dom element array
	videos: [],

	currentFocusVideos: [],

	videoWidth: (function(){return screen.width/4})(),
	// videoHeight: (function(){return screen.height})(),
	idCounter: 0,
	videoContainer: (function(){return document.getElementsByClassName("container")[0];})(),
	_clearCurrentFocusVideos: function(){
		while( this.currentFocusVideos.length > 0 ){
			this.currentFocusVideos.pop();
		}
	},

	hasFocusVideo: function() {
		return this.currentFocusVideos.length > 0;
	},

	_addVideo: function() {

		// format of my video
		// <video id="video" controls="" preload="none" mediagroup="myVideoGroup" poster="http://images2.itechpost.com/data/images/full/37245/piko-taro-ppap.jpg">
		// 	<source id="src-mp4" src="https://video.xx.fbcdn.net/v/t43.1792-2/14439457_1670493943279877_6211803525098242048_n.mp4?efg=eyJybHIiOjE1MDAsInJsYSI6MTAyNCwidmVuY29kZV90YWciOiJzdmVfaGQifQ%3D%3D&rl=1500&vabr=846&oh=8752f9aed4970de1dbb4d0e9201be357&oe=582BA419" type="video/mp4">
		// </video>

		drawText(`Added one video.`);

		// remove the hello message
		document.getElementById("hello-msg").style.display = "none";

		// const POSTER_URL = "http://images2.itechpost.com/data/images/full/37245/piko-taro-ppap.jpg";
		// const POSTER_URL = "resource/ppap-poster.jpg";
		const POSTER_URL = "https://media.w3.org/2010/05/sintel/poster.png";
		const VIDEO_URL = "https://media.w3.org/2010/05/sintel/trailer.mp4";

		let videoWrap = document.createElement("div");
		videoWrap.setAttribute("class", "video-wrap");
		// videoWrap.setAttribute("width", this.videoWidth);
		videoWrap.style.width = `${this.videoWidth}px`;
		if ( this.videoHeight !== undefined ) {
			// videoWrap.setAttribute("height", this.videoHeight);
			videoWrap.style.height = `${this.videoHeight}px`;
		}

		let videoOverlay = document.createElement("div");
		videoOverlay.setAttribute("class", "video-overlay");

		let video = document.createElement("video");
		video.setAttribute("preload", "none");
		video.setAttribute("poster", POSTER_URL);
		video.width = this.videoWidth;
		// video.src = "./resource/ppap.mp4";
		video.src = VIDEO_URL;
		video.autoplay = false;

		videoWrap.appendChild(videoOverlay);
		videoWrap.appendChild(video);
		this.videoContainer.appendChild(videoWrap);

		const videoID = this._getID();
		this.videos.push({
			id: videoID,
			dom: videoWrap
		});


		// bad implementation of getting the 
		if (VC.videoHeight === undefined) {
			setTimeout(function(){
				let videoWrap = VC.videos[0].dom;
				VC.videoHeight = videoWrap.querySelector("video").getBoundingClientRect().height;
				videoWrap.style.height = `${VC.videoHeight}px`;
			}, 400);
		}

		// console.log(this.videos);
	
	},
	_getID: function() {
		const id = this.idCounter;
		this.idCounter++;
		return id;
	},
	_setVideoSize: function( id, up ) {

		if ( up ) {
			drawText("Enlarge the selected video");
		} else {
			drawText("Shrink the selected video");
		}

		const videoObject = this._findVideoWithID( id );
		const videoWrap = videoObject.dom;
		const video = videoWrap.querySelector("video");

		let delta = (up)?30:-30;
		video.width = video.width + delta;

		// set 
		const marginLeft = (videoWrap.getBoundingClientRect().width - video.getBoundingClientRect().width)/2;
		const marginTop = (videoWrap.getBoundingClientRect().height - video.getBoundingClientRect().height)/2;

		video.style.marginLeft = `${marginLeft}px`;
		video.style.marginTop = `${marginTop}px`;

	},
	_setVideoVolume: function( id, up ) {

		if ( up ) {
			drawText("Louder!!");
		} else {
			drawText("Quiet!!");
		}

		const videoObject = this._findVideoWithID( id );
		const videoWrap = videoObject.dom;
		const video = videoWrap.querySelector("video");

		const delta = (up)?0.15: -0.15;
		if ( parseFloat(video.volume) > 1 || parseFloat(video.volume) < 0 ) return; 
		video.volume = video.volume + delta;

	},
	_setVideoPlaybackSpeed: function( id, up ) {

		if ( up ) {
			drawText("Set faster speed for selected video!!");
		} else {
			drawText("Set slower speed for selected video!!");
		}

		const videoObject = this._findVideoWithID( id );
		const videoWrap = videoObject.dom;
		const video = videoWrap.querySelector("video");

		const delta = (up)?0.15: -0.15;

		console.log(`Trying to set video playback speed to ${video.playbackRate + delta}...`);

		if ( parseFloat(video.playbackRate) >= 2 || parseFloat(video.playbackRate) < -2 ) return;
		try{
			video.playbackRate = video.playbackRate + delta;
		}
		catch(e){
			console.log(e);
		}
		

	},
	_setVideoSeek: function( id, up ) {

		if ( up ) {
			drawText("Fastforward the selected video!!");
		} else {
			drawText("Rewind the selected video!!");
		}

		const videoObject = this._findVideoWithID( id );
		const videoWrap = videoObject.dom;
		const video = videoWrap.querySelector("video");

		const delta = (up)?10: -10;
		video.currentTime = video.currentTime + delta;

	},
	_removeVideo: function( id ) {

		// remove the video
		let videoObject = this._findVideoWithID(id);
		let videoWrap = videoObject.dom;
		videoWrap.remove();

		// remove the object
		const indexOfDeleteTarget = this.videos.findIndex((v)=>(v.id === id));
		if ( indexOfDeleteTarget > -1 ){
			this.videos.splice(indexOfDeleteTarget, 1);
		}

		// check if the video is in focus, we'll have to maintain the array
		const indexOfDeleteTargetInFocus = this.currentFocusVideos.findIndex( (v)=>( v.id === videoObject.id ));
		if ( indexOfDeleteTargetInFocus >= 0 ) {
			this.currentFocusVideos.splice(indexOfDeleteTargetInFocus, 1);
		}
		// VC._clearCurrentFocusVideos();

		if ( VC.videos.length === 0 ) {
			document.getElementById("hello-msg").style.display = "table";
		}

	},
	_playVideo: function( id ) {
		let videoObject = this._findVideoWithID(id);
		// console.log(videoObject);
		videoObject.dom.querySelector("video").play();
	},
	_pauseVideo: function( id ) {
		let videoWrap = this._findVideoWithID(id);
		// console.log(videoWrap);
		videoWrap.dom.querySelector("video").pause();
	},
	_muteVideo: function( id ) {
		const videoWrap = this._findVideoWithID(id);
		const video = videoWrap.dom.querySelector("video");
		video.muted = !video.muted;
	},

	_highlightVideo: function( id ) {

		const videoObject = this._findVideoWithID( id );
		const videoWrap = videoObject.dom;
		const videoHeight = videoWrap.querySelector("video").getBoundingClientRect().height;
		const videoWidth = videoWrap.querySelector("video").getBoundingClientRect().width;
		let overlay = videoWrap.querySelector("div");
		overlay.style.cssText = overlay.style.cssText + `width:${videoWidth}px; height: ${videoHeight}px;`;
		overlay.style.opacity = 0;

		let stopAnimation = false;

		let fadeIn = function( videoObject ){
			let overlay = videoObject.dom.querySelector("div");
			let _opacity = 1;

			let fadeInToken = setInterval(function(){
				if (_opacity > 0){
					_opacity -= 0.1;
					overlay.style.opacity = _opacity;
				}else{
					clearInterval(fadeInToken);
					overlay.style.opacity = 0;
					// if (!stopAnimation){
					// fadeIn(videoObject);
					// }
				}
			}, 50);

		};

		let fadeOut = function( videoObject ) {
			let overlay = videoObject.dom.querySelector("div");
			let _opacity = 0; 
			let fadeOutToken = setInterval(function(){
				if ( _opacity <= 1){
					
					_opacity += 0.1;
					overlay.style.opacity = _opacity;
					
				} else {
					overlay.style.opacity = 1;
					clearInterval(fadeOutToken);
					fadeIn(videoObject);	
				} 
			}, 50);
		};

		fadeOut(videoObject);

	},
	_unhighlightVideo: function( id ){

		let videoObject = this._findVideoWithID(id);
		let videoWrap = videoObject.dom;
		
		let overlay = videoWrap.querySelector("div");
		// overlay.style.backgroundColor = "transparent";
		overlay.style.opacity = 0;
		// overlay.style.cssText = `width:${videoWidth}px; height: ${videoHeight}px; background-color: transparent;`;

	},
	_findVideoWithID: function( id ) {
		// returns the video object saved in the VC.videos
		return this.videos.filter((v)=>(v.id === id))[0];
	}


}



IC.init();


//
// Startup
//
var _isDown, _points, _r, _g, _rc;

function onLoadEvent() {

	console.log('Page on load...');
	_points = new Array();
	_r = new DollarRecognizer();

	var canvas = document.getElementById('input-canvas');
	_g = canvas.getContext('2d');
	_g.fillStyle = "rgb(0,0,225)";
	_g.strokeStyle = "rgb(0,0,225)";
	_g.lineWidth = 8;
	_g.font = "16px Gentilis";
	_rc = getCanvasRect(canvas); // canvas rect on page
	_g.fillStyle = "rgb(255,255,136)";

	// draw the yellow top bar
	_g.fillRect(0, 0, _rc.width, 20);

	_isDown = false;
}


function getCanvasRect( canvas ) {
	var w = canvas.width;
	var h = canvas.height;

	var cx = canvas.offsetLeft;
	var cy = canvas.offsetTop;
	while (canvas.offsetParent != null)
	{
		canvas = canvas.offsetParent;
		cx += canvas.offsetLeft;
		cy += canvas.offsetTop;
	}
	return {x: cx, y: cy, width: w, height: h};
}

function getScrollY() {
	var scrollY = $(window).scrollTop();
	return scrollY;
}
//
// Mouse Events
//
function mouseDownEvent( x, y ) {

	// if time out token not cleaned, meaning in several seconds the program will clean the canvas.
	// to prvent this from happening while the user draw new gesture, we clear and remove the timeout token.
	if ( typeof _r.timeoutToken !== "undefined" ) {
		clearTimeout(_r.timeoutToken);
		_r.timeoutToken = undefined;
	}

	document.onselectstart = function() { return false; } // disable drag-select
	document.onmousedown = function() { return false; } // disable drag-select
	_isDown = true;
	x -= _rc.x;
	y -= _rc.y - getScrollY();
	if (_points.length > 0)
		_g.clearRect(0, 0, _rc.width, _rc.height);
	_points.length = 1; // clear
	_points[0] = new Point(x, y);
	drawText("Recording unistroke...");
	_g.fillRect(x - 4, y - 3, 9, 9);
}

function mouseMoveEvent( x, y ) {
	if (_isDown)
	{
		x -= _rc.x;
		y -= _rc.y - getScrollY();
		_points[_points.length] = new Point(x, y); // append
		drawConnectedPoint(_points.length - 2, _points.length - 1);
	}
}
function mouseUpEvent( x, y ){
	document.onselectstart = function() { return true; } // enable drag-select
	document.onmousedown = function() { return true; } // enable drag-select
	if ( _isDown ){

		_isDown = false;
		if ( _points.length >= 10 ) {

			var result = _r.Recognize(_points, false /*document.getElementById('useProtractor').checked*/);
			// drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");

			if (result.Name === "question") {
				IC.showQuestion();
			}

			else if (result.Name === "add" || result.Name === "four" ) {

				IC.showSelectUIHint();
				if ( result.Name === "add" ) { 
					VC._addVideo();
				} else {
					for ( let i = 0; i < 4; i++ ) {
						VC._addVideo();
					}
				}
				
				
			
			} else {
				// focus type

				// check there are videos in the current stack
				if ( VC.videos.length === 0 ) {
					drawText("Please draw A to add a video first");
					return;
				}

				if ( IC.FOCUS_GESTURES.indexOf(result.Name) >= 0 ) {

					IC.showSubUIHint();

					// move the current focus or go to the first focus
					if ( result.Name == "arrow" ){

						IC.arrow();

					// toggle all videos.
					} else {
						IC.all();
					}
					
				// Sub UI Type
				} else if ( IC.SUBUI_GESTURES.indexOf(result.Name) >= 0 ) {

					IC.showValueSelectionHint();
					if ( result.Name === "size" ) 			IC.activateSize();
					if ( result.Name === "playbackSpeed" )  IC.activatePlaybackSpeed();
					if ( result.Name === "seek" ) 			IC.activateSeek();
					if ( result.Name === "volume" || result.Name === "volume2") IC.activateVolume();

				// execution type
				} else if ( IC.SINGLE_OP_GESTURES.indexOf(result.Name) >= 0 ) {

					IC.showSubUIHint();
					if ( result.Name === "delete" ) IC.delete();
					if ( result.Name === "pause" )  IC.pause();
					if ( result.Name === "mute" )   IC.mute();
					if ( result.Name === "play" || result.Name === "triangle") IC.play(); 

				// up and down
				} else {
					
					let up = false;
					if ( result.Name === "up") up = true;

					switch (IC.subUI) {
						case "size":
							IC.resize(up);
							break;

						case "volume":
							IC.volume(up);
							break;

						case "playbackSpeed":
							IC.playbackSpeed(up);
							break;

						case "seek":
							IC.seek(up)
							break;

						default:
							break;
					}

				}
			}

			// clear the canvas if no one touch it again in 5 seconds
			_r.timeoutToken = setTimeout(function(){
				_g.clearRect(0, 0, _rc.width, _rc.height);
			}, 5000);

		}
		else { // fewer than 10 points were inputted
			drawText("Too few points made. Please try again.");
		}


	}

}

function drawText( str ) {
	_g.fillStyle = "rgb(255,255,136)";
	_g.fillRect(0, 0, _rc.width, 20);
	_g.fillStyle = "rgb(0,0,255)";
	_g.fillText(str, 1, 14);
}

function drawConnectedPoint( from, to ){
	_g.beginPath();
	_g.moveTo(_points[from].X, _points[from].Y);
	_g.lineTo(_points[to].X, _points[to].Y);
	_g.closePath();
	_g.stroke();
}

/**
round 'n' to 'd' decimals
*/
function round( n, d ) {
	d = Math.pow(10, d);
	return Math.round(n * d) / d
}

//
// Unistroke Adding and Clearing
//
function onClickAddExisting() {
	if ( _points.length >= 10 ){
		var unistrokes = document.getElementById('unistrokes');
		var name = unistrokes[unistrokes.selectedIndex].value;
		var num = _r.AddGesture(name, _points);
		drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
	}
}

function onClickDelete(){
	var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
	alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
}


