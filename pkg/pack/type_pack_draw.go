package pack

import (
	"fmt"

	pages "github.com/bis83/basilico/pkg/pages"
)

type Draw struct {
	Mesh   int        `json:"mesh"`
	Shader int        `json:"shader"`
	Image  int        `json:"image"`
	Ortho  bool       `json:"ortho"`
	State  *DrawState `json:"state"`
}

type DrawState struct {
	Depth bool `json:"d"`
	Alpha bool `json:"a"`
	Cw    bool `json:"cw"`
}

func (p *Draw) Set(src *pages.Pages, s *pages.Draw) error {
	p.Mesh = src.FindMesh(s.Mesh)
	if p.Mesh <= 0 {
		return fmt.Errorf("Mesh Not Found: %s", s.Mesh)
	}
	p.Shader = src.FindShader(s.Shader)
	if p.Shader <= 0 {
		return fmt.Errorf("Shader Not Found: %s", s.Shader)
	}
	p.Image = src.FindImage(s.Image)
	p.Ortho = s.Ortho

	var state DrawState
	if s.State != nil {
		state.Depth = s.State.Depth
		state.Alpha = s.State.Alpha
		state.Cw = s.State.Cw
	}
	p.State = &state

	return nil
}
