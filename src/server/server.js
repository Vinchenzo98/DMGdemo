const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let health = 20;

function updateHealth(){
    health = Math.max(0, health - 1); 
    updateEnemyHealth()
}


function updateBar(){
  const healthPercentage = health / 20;
  // Broadcast the updated health to all clients
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'updateBar', healthPercentage: healthPercentage }));
    }
  });
}

function updateColour(){
  wss.clients.forEach(client =>{
    if(client.readyState === WebSocket.OPEN){
      client.send(JSON.stringify({type: 'updateColour'}))
    }
  })
}

function updateEnemyHitAnim(){
  wss.clients.forEach(client =>{
    if(client.readyState === WebSocket.OPEN){
      client.send(JSON.stringify({type: 'updateEnemyHitAnim'}))
    }
  })
}

function updateEnemyHealth() {
  // Broadcast the updated health to all clients
  wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'updateHealth', health: health }));
          updateBar(); 
          updateColour();
          updateEnemyHitAnim();
      }
  });
}

wss.on('connection', ws => {
  ws.on('message',  message => {
    console.log('Received:', message);
    const data = JSON.parse(message);
    if (data.type === 'hit') {
        updateHealth()
      }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');
