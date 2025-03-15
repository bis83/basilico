package basil3d

func (p *App) buildMob(src *Source) error {
	p.Mob = make(map[string]*AppMob, len(src.Mob))
	for k, v := range src.Mob {
		var a AppMob
		a.Mesh = make([]*AppMesh, 0, len(v.Mesh))
		for _, x := range v.Mesh {
			var m AppMesh
			m.Data = x.Data
			m.X = x.X
			m.Y = x.Y
			m.Z = x.Z
			m.HA = x.HA
			m.VA = x.VA
			m.Factor0 = x.Factor0.toFloat()
			m.Factor1 = x.Factor1.toFloat()
			m.Factor2 = x.Factor2.toFloat()
			a.Mesh = append(a.Mesh, &m)
		}
		a.Mass = v.Mass
		a.Radius = v.Radius
		a.Height = v.Height
		p.Mob[k] = &a
	}
	return nil
}
