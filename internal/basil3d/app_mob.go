package basil3d

type AppMob struct {
	Mesh   []*AppMesh `json:"mesh"`
	Mass   float32    `json:"mass"`
	Radius float32    `json:"radius"`
	Height float32    `json:"height"`
}

func (p *App) buildMob(src *Source) error {
	p.Mob = make(map[string]*AppMob, len(src.Mob))
	for k, v := range src.Mob {
		var a AppMob
		a.Mesh = make([]*AppMesh, 0, len(v.Mesh))
		for _, x := range v.Mesh {
			var m AppMesh
			m.set(x)
			a.Mesh = append(a.Mesh, &m)
		}
		a.Mass = v.Mass
		a.Radius = v.Radius
		a.Height = v.Height
		p.Mob[k] = &a
	}
	return nil
}
