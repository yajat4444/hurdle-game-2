class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,100,60,60);
    car1.addImage("c", c1Img);
    car2 = createSprite(200,100,60,60);
    car2.addImage("c", c2Img);
    car3 = createSprite(300,100,60,60);
    car3.addImage("c", c3Img);
    car4 = createSprite(400,100,60,60);
    car4.addImage("c", c4Img);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, -displayHeight*4,0,displayWidth*5, displayHeight);
      
      var index = 0;

      var x;
      var y = 0;

      for(var plr in allPlayers){
     
        index = index + 1 ;
        y = y + 150;
        cars[index-1].y = y;
        x = allPlayers[plr].distance;        
        cars[index-1].x = x;

        hurdle1 = createSprite(300, y, 30, 30);
        hurdle1.shapeColor = "yellow";

        hurdle2 = createSprite(800, y, 30, 30);
        hurdle2.shapeColor = "red";
 
        if(keyIsDown(UP_ARROW)){    
          cars[index-1].y-=60;
        }
        if(cars[index-1].collide(hurdle1) || cars[index-1].collide(hurdle2)){    
          if(cars[index-1].y%150===0){    
            player.distance = 0;
            player.update();
          }
        }

        if (index === player.index){          
          cars[index - 1].shapeColor = "blue";
          camera.position.x = cars[index-1].x;
          camera.position.y = displayHeight/2;
        }
      }
    }

    if(keyIsDown(RIGHT_ARROW) && player.index !== null){
      Player.getPlayerInfo();
      console.log(player.distance);
      player.distance +=10
      player.update();
    }

    if(player.distance >= 1270){
      textSize(40);
      textStyle("bold");
      fill(0);
      text("Congratulations " + player.name + " !!", 1200,200);
      text("You have reached the finish line!", 1150, 250);
      gameState = 2;
      player.rank +=1;
      Player.updateCarsAtEnd(player.rank);
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
