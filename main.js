// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(889, 500, Phaser.AUTO, 'gameDiv');

var restartButton;
//var blaster;

// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
        // Change the background color of the game
        game.stage.backgroundColor = '#000';

        // Load the player sprite
        game.load.image('player', 'assets/player.png');  

        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');   

		// Load the extraPoints image
		game.load.image('extraPoints', 'assets/extraPoints.png');   
		
		// //Load audio
		// game.load.audio('blaster', 'assets/audio/blaster.mp3');
    },

	
    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the player on the screen
        this.player = this.game.add.sprite(100, 100, 'player');
        
        // Add gravity to the player to make it fall
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 800; 

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
		
		this.game.input.onTap.add(this.jump);
		
		/*if (game.input.pointer1.isDown){
			this.jump;
		}*/
		
        // Create a group of 40 pipes
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(40, 'pipe');  
		
		this.extraPoints = game.add.group();
		this.extraPoints.enableBody = true;
		this.extraPoints.createMultiple(2, 'extraPoints');  

        // Timer that calls 'addRowOfPipes' ever 2 seconds
        this.timer = this.game.time.events.loop(2000, this.addRowOfPipes, this);   

		this.timer = this.game.time.events.loop(3000, this.addObjects, this);  

		this.timer = this.game.time.events.loop(500, this.addDistance, this);  

        // Add a score label on the top left of the screen
        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
		
		// Add Game Over label at the centre of the screen
		this.labelGameOver = this.game.add.text(800/2, 460/2, "Game Over", { font: "30px Arial", fill: "#ffffff" });  
		this.labelGameOver.visible = false;
		
		// Add Game Over label at the centre of the screen (game.world.centerX)
		this.restartButton = game.add.button(800/2, 300, 'player', this.restart, this);
		this.restartButton.visible = false;
		
		//newButton = new Phaser.Button(game, 800/2, 300, 'player', this.restartGame, this, 0, 0, 1, 0);

		// button.onInputOver.add(over, this);
		// button.onInputOut.add(out, this);
		this.restartButton.events.onInputDown.add(this.restartGame, this);


// function up() {
    // console.log('button up', arguments);
// }
		
		//this.blaster = game.add.audio('blaster');
    },

    // This function is called 60 times per second
    update: function() {
		// If the player is out of the world (too high or too low), call the 'restartGame' function
		if (this.player.inWorld == false)
			this.gameOver(); 

		// If the player overlap any pipes, call 'gameOver'
		game.physics.arcade.overlap(this.player, this.pipes, this.gameOver, null, this); 
		
		// If the player overlap any flying objects, call 'addScore'
		game.physics.arcade.overlap(this.player, this.extraPoints, this.addScore, null, this); 
    },
	
	gameOver: function() {
		game._paused = true;
		this.labelGameOver.visible = true;
		this.restartButton.visible = true;
	},
	
    // Make the player jump 
    jump: function() {
        // Add a vertical velocity to the player
        this.player.body.velocity.y = -250;
		//blaster.play();
    },
	
    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    // Add a pipe on the screen
    addOnePipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -300; 
               
        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    addRowOfPipes: function() {
		var place = Math.floor(Math.random()*2)+1;
        
		var ran = Math.floor(Math.random()*6)+1;
		 if (place === 1) 
			for (var i = 0; i < ran; i++)
				this.addOnePipe(889, i*50);  
		else{
			for (var i = 0; i < ran; i++)
				this.addOnePipe(889, 450-(i*50));  
		}
    
        // this.score += 1;
        // this.labelScore.text = this.score;  
    },
	
	// Add extra points when advantageous object is collected
	addDistance: function() {
		this.score += 1;
        this.labelScore.text = this.score; 
	},
	
	// Add extra points when advantageous object is collected
	addScore: function() {
		this.score += 50;
        this.labelScore.text = this.score; 
		this.extraPoints.destroy();
	},
	
	addObjects: function() {		
		if (this.score === 30){
			// Get the first dead points of our group
			var points = this.extraPoints.getFirstDead();

			// Set the new position of the points
			points.reset(400, 250);

			// Add velocity to the points to make it move left
			points.body.velocity.x = -300; 
				   
			// Kill the points when it's no longer visible 
			points.checkWorldBounds = true;
			points.outOfBoundsKill = true;
			}
	},
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 