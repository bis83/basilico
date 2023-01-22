package pack

import (
	pages "github.com/bis83/basilico/pkg/oldpack/pages"
)

type Hit struct {
	Draw   int        `json:"draw"`
	Action [][]string `json:"action"`
}

func (p *Hit) Set(src *pages.Pages, s *pages.Hit) error {
	p.Draw = src.FindDraw(s.Draw)
	p.Action = s.Action
	return nil
}
