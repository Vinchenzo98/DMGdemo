import { activate } from "./switchMaterial";
import { createCube } from './scene-utils';
import { redMaterial } from "./switchMaterial";
import { greenMaterial } from "./switchMaterial";
import { textEntity } from "./switchMaterial";
import * as utils from '@dcl/ecs-scene-utils'

// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

let health;

const robots = new Entity();
robots.addComponent(new GLTFShape('models/Robots.glb'));
robots.addComponent(
  new Transform({
    position: new Vector3(12, 0, 2)
  })
);
engine.addEntity(robots);

//Robot Animations
robots.addComponent(new Animator())
robots.getComponent(Animator).addClip(new AnimationState("attack"))
robots.getComponent(Animator).getClip("attack").looping = false
robots.getComponent(Animator).addClip(new AnimationState("hit"))
robots.getComponent(Animator).getClip("hit").looping = false
robots.getComponent(Animator).addClip(new AnimationState("death"))
robots.getComponent(Animator).getClip("death").looping = false

// Robot feedback cube 1
const robot1Cube = createCube(new Vector3(13.2, 1.5, 2), 'Boss');
robot1Cube.getComponent(Transform).scale.x = 1;
robot1Cube.getComponent(Transform).scale.y = 0.3;
robot1Cube.getComponent(Transform).scale.z = 0.2;

// Click event
robots.addComponent(
  new OnPointerDown(
    (e) => {
      log(e.hit.meshName);
      if (e.hit.meshName === 'Droid_01') {
        activate(robot1Cube, ws); 
      }
    },
    { button: ActionButton.POINTER, showFeedback: false }
  )
);

ws.onopen = () => {
  log('Connected to WebSocket server');
};

function updateHealth(newHealth) {
    health = newHealth; 
    textEntity.getComponent(TextShape).value = health.toString();
}

function updateBar(healthPercentage) { 
  robot1Cube.getComponent(Transform).scale.x = healthPercentage; 
}

function updateEnemyHitAnim(){
  robots.getComponent(Animator).getClip("hit").looping = false
  robots.getComponent(Animator).getClip("hit").play()
}

function updateColour(){
  robot1Cube.addComponentOrReplace(redMaterial);
  utils.setTimeout(250, () => {
    robot1Cube.addComponentOrReplace(greenMaterial);
  });
}

ws.onmessage = (event) => {
  // Handle incoming messages
  const data = JSON.parse(event.data);
  if (data.type === 'updateHealth') {
    updateHealth(data.health);
  }
  if(data.type === 'updateBar'){
    updateBar(data.healthPercentage)
  }
  if(data.type === 'updateColour'){
    updateColour()
  }
  if(data.type === 'updateEnemyHitAnim'){
    updateEnemyHitAnim()
  }

};

ws.onerror = (error) => {
  log('WebSocket error:', error);
};



