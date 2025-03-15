package basil3d

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
		a.Entity = make([]*AppStageEntity, 0, len(v.Entity))
		for _, b := range v.Entity {
			var c AppStageEntity
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
					Color:    b.Light.Color.toFloat(),
					Ambient0: b.Light.Ambient0.toFloat(),
					Ambient1: b.Light.Ambient1.toFloat(),
				}
			}
			a.Entity = append(a.Entity, &c)
		}
		p.Stage[k] = &a
	}
	return nil
}
