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
		a.Room = make([]*AppStageRoom, 0, len(v.Room))
		for _, b := range v.Room {
			var c AppStageRoom
			c.Data = b.Data
			c.X = b.X
			c.Y = b.Y
			c.Z = b.Z
			c.HA = b.HA
			c.VA = b.VA
			a.Room = append(a.Room, &c)
		}
		a.Mob = make([]*AppStageMob, 0, len(v.Mob))
		for _, b := range v.Mob {
			var c AppStageMob
			c.Data = b.Data
			c.X = b.X
			c.Y = b.Y
			c.Z = b.Z
			c.HA = b.HA
			c.VA = b.VA
			a.Mob = append(a.Mob, &c)
		}
		a.Camera = make([]*AppStageCamera, 0, len(v.Camera))
		for _, b := range v.Camera {
			var c AppStageCamera
			c.X = b.X
			c.Y = b.Y
			c.Z = b.Z
			c.HA = b.HA
			c.VA = b.VA
			c.Fov = b.Fov
			c.Near = b.Near
			c.Far = b.Far
			a.Camera = append(a.Camera, &c)
		}
		a.Light = make([]*AppStageLight, 0, len(v.Light))
		for _, b := range v.Light {
			var c AppStageLight
			c.HA = b.HA
			c.VA = b.VA
			c.Color = b.Color.toFloat()
			c.Ambient0 = b.Ambient0.toFloat()
			c.Ambient1 = b.Ambient1.toFloat()
			a.Light = append(a.Light, &c)
		}
		p.Stage[k] = &a
	}
	return nil
}
