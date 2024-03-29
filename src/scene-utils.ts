// spawn cube

export function createCube(pos: Vector3, label: string) {
  const cube = new Entity()
  cube.addComponent(
    new Transform({
      position: pos
    })
  )
cube.addComponent(new BoxShape())
  engine.addEntity(cube)
  addLabel(label, cube)

  return cube
}

export const textOffset = new Transform({
  position: new Vector3(0, 1.5, 0)
})

// add label to cube

export function addLabel(text: string, parent: IEntity) {
  const label = new Entity()
  label.setParent(parent)
  label.addComponent(new Billboard())
  label.addComponent(textOffset)
  label.addComponent(new TextShape(text))
  label.getComponent(TextShape).fontSize = 3
  label.getComponent(TextShape).color = Color3.White()

  engine.addEntity(label)
}
