

// reusable materials
export const greenMaterial = new Material()
greenMaterial.albedoColor = Color3.Green()

export const redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()

const transform = new Transform()
transform.position = new Vector3(0, 3, 0)
transform.scale = new Vector3(0.5,1,0.5)
transform.rotation.setEuler(0,180,0)


export const textEntity = new Entity()
const myText = new TextShape()
myText.fontSize = 30
myText.color = Color3.Blue()
myText.font = new Font(Fonts.SansSerif)
textEntity.addComponent(myText)
textEntity.addComponent(transform)



export function activate(entity: Entity, ws: WebSocket) {
  textEntity.setParent(entity)
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'hit' }));
  }

}


