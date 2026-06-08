const pollRoutes = require("./routes/poll.routes"); 
  app.use( 
    "/api/polls", pollRoutes 
  ); 

  const chatRoutes = require("./routes/chat.routes"); 
  app.use( "/api/chat", chatRoutes ); 

  const teamRoutes =     require("./routes/team.routes");  
  const playerRoutes =     require("./routes/player.routes");  
  const injuryRoutes =     require("./routes/injury.routes"); 
   app.use(     "/api/teams",     teamRoutes );  
   app.use(     "/api/players",     playerRoutes );  
  app.use(     "/api/injuries",     injuryRoutes ); 
  
  
  const matchRoutes = require("./routes/match.routes"); 
  app.use( "/api/matches", matchRoutes ); 


  const teamRatingRoutes =     require(         "./routes/teamRating.routes"     );  
  const playerRatingRoutes =     require(         "./routes/playerRating.routes"     );  
  app.use(     "/api/team-ratings",     teamRatingRoutes );  
  app.use(     "/api/player-ratings",     playerRatingRoutes );  