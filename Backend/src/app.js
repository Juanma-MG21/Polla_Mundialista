const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const pollRoutes = require("./routes/poll.routes");
app.use("/api/polls", pollRoutes);

const chatRoutes = require("./routes/chat.routes");
app.use("/api/chat", chatRoutes);

const teamRoutes = require("./routes/team.routes");
const playerRoutes = require("./routes/player.routes");
const injuryRoutes = require("./routes/injury.routes");

app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/injuries", injuryRoutes);

const matchRoutes = require("./routes/match.routes");
app.use("/api/matches", matchRoutes);

const teamRatingRoutes = require("./routes/teamRating.routes");
const playerRatingRoutes = require("./routes/playerRating.routes");

app.use("/api/team-ratings", teamRatingRoutes);
app.use("/api/player-ratings", playerRatingRoutes);

const predictionRoutes =
    require("./routes/prediction.routes");

app.use(
    "/api/predictions",
    predictionRoutes
);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente"
  });
});

module.exports = app;