package basil3d

type AppStage struct {
	Step    []*AppStageStep    `json:"step"`
	Content []*AppStageContent `json:"content"`
}
type AppStageStep struct {
	Label string `json:"label,omitempty"`
	Event string `json:"event,omitempty"`
	Goto  string `json:"goto,omitempty"`
	Solve bool   `json:"solve,omitempty"`
	Yield bool   `json:"yield,omitempty"`
}
type AppStageContent struct {
	Tile   *AppStageTile   `json:"tile,omitempty"`
	Room   *AppStageRoom   `json:"room,omitempty"`
	Mob    *AppStageMob    `json:"mob,omitempty"`
	Camera *AppStageCamera `json:"camera,omitempty"`
	Light  *AppStageLight  `json:"light,omitempty"`
}
type AppStageTile struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	W    float32 `json:"w"`
	H    float32 `json:"h"`
}
type AppStageRoom struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type AppStageMob struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type AppStageCamera struct {
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
	Fov  float32 `json:"fov"`
	Near float32 `json:"near"`
	Far  float32 `json:"far"`
}
type AppStageLight struct {
	HA       float32  `json:"ha"`
	VA       float32  `json:"va"`
	Color    AppColor `json:"color"`
	Ambient0 AppColor `json:"ambient0"`
	Ambient1 AppColor `json:"ambient1"`
}

func (p *App) buildStage(src *Source) error {
	p.Stage = make(map[string]*AppStage, len(src.Stage))
	for k, v := range src.Stage {
		var a AppStage
		a.Step = make([]*AppStageStep, 0, len(v.Step))
		for _, b := range v.Step {
			var c AppStageStep
			c.Label = b.Label
			c.Event = b.Event
			c.Goto = b.Goto
			c.Solve = b.Solve
			c.Yield = b.Yield
			a.Step = append(a.Step, &c)
		}
		a.Content = make([]*AppStageContent, 0, len(v.Content))
		for _, b := range v.Content {
			var c AppStageContent
			if b.Tile != nil {
				c.Tile = &AppStageTile{
					Data: b.Tile.Data,
					X:    b.Tile.X,
					Y:    b.Tile.Y,
					W:    b.Tile.W,
					H:    b.Tile.H,
				}
			}
			if b.Room != nil {
				c.Room = &AppStageRoom{
					Data: b.Room.Data,
					X:    b.Room.X,
					Y:    b.Room.Y,
					Z:    b.Room.Z,
					HA:   b.Room.HA,
					VA:   b.Room.VA,
				}
			}
			if b.Mob != nil {
				c.Mob = &AppStageMob{
					Data: b.Mob.Data,
					X:    b.Mob.X,
					Y:    b.Mob.Y,
					Z:    b.Mob.Z,
					HA:   b.Mob.HA,
					VA:   b.Mob.VA,
				}
			}
			if b.Camera != nil {
				c.Camera = &AppStageCamera{
					X:    b.Camera.X,
					Y:    b.Camera.Y,
					Z:    b.Camera.Z,
					HA:   b.Camera.HA,
					VA:   b.Camera.VA,
					Fov:  b.Camera.Fov,
					Near: b.Camera.Near,
					Far:  b.Camera.Far,
				}
			}
			if b.Light != nil {
				c.Light = &AppStageLight{
					HA:       b.Light.HA,
					VA:       b.Light.VA,
					Color:    toAppColor0000(b.Light.Color),
					Ambient0: toAppColor0000(b.Light.Ambient0),
					Ambient1: toAppColor0000(b.Light.Ambient1),
				}
			}
			a.Content = append(a.Content, &c)
		}
		p.Stage[k] = &a
	}
	return nil
}
