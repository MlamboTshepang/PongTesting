using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace PongGame
{
    public class PongHub : Hub
    {
        private static ConcurrentDictionary<string, Player> players = new();
        private static GameState gameState = new();

        public async Task JoinGame(string playerName)
        {
            var connectionId = Context.ConnectionId;
            if (!players.ContainsKey(connectionId))
            {
                var player = new Player { Name = playerName, ConnectionId = connectionId, PositionY = 50 };
                players[connectionId] = player;
            }
            await Clients.All.SendAsync("UpdatePlayers", players.Values);
        }

        public async Task MovePaddle(string connectionId, int positionY)
        {
            if (players.ContainsKey(connectionId))
            {
                players[connectionId].PositionY = positionY;
                await Clients.All.SendAsync("UpdatePlayers", players.Values);
            }
        }

        public async Task StartGame()
        {
            gameState.Reset();
            await Clients.All.SendAsync("GameStarted", gameState);
        }
    }

    public class Player
    {
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public int PositionY { get; set; }
    }

    public class GameState
    {
        public int BallX { get; set; } = 50;
        public int BallY { get; set; } = 50;
        public int BallSpeedX { get; set; } = 2;
        public int BallSpeedY { get; set; } = 2;

        public void Reset()
        {
            BallX = 50;
            BallY = 50;
            BallSpeedX = 2;
            BallSpeedY = 2;
        }
    }
}
