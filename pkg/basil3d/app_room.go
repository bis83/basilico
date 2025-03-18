package basil3d

type AppRoom struct {
	Mesh   []*AppMesh       `json:"mesh"`
	Layout []*AppRoomLayout `json:"layout"`
}
type AppRoomLayout struct {
	Node    []*AppRoomNode `json:"node"`
	Unit    float32        `json:"unit"`
	Divisor int            `json:"divisor"`
	Indices []int          `json:"indices"`
}
type AppRoomNode struct {
	Mesh   []int   `json:"mesh"`
	Height float32 `json:"height"`
}

func (p *App) buildRoom(src *Source) error {
	p.Room = make(map[string]*AppRoom, len(src.Room))
	for k, v := range src.Room {
		var a AppRoom

		a.Mesh = make([]*AppMesh, 0, len(v.Mesh))
		for _, x := range v.Mesh {
			var m AppMesh
			m.set(x)
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
