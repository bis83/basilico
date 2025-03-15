package basil3d

func (p *App) buildRoom(src *Source) error {
	p.Room = make(map[string]*AppRoom, len(src.Room))
	for k, v := range src.Room {
		var a AppRoom

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

		a.Layout = make([]*AppRoomLayout, 0, len(v.Layout))
		for _, x := range v.Layout {
			var m AppRoomLayout
			m.Unit = x.Unit
			m.Divisor = x.Divisor
			m.Indices = x.Indices
			m.Node = make([]*AppRoomNode, 0, len(x.Node))
			for _, a := range x.Node {
				if a == nil {
					m.Node = append(m.Node, nil)
				} else {
					var b AppRoomNode
					b.Mesh = a.Mesh
					b.Height = a.Height
					m.Node = append(m.Node, &b)
				}
			}
			a.Layout = append(a.Layout, &m)
		}

		p.Room[k] = &a
	}
	return nil
}
