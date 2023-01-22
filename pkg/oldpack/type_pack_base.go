package pack

import (
	"fmt"

	pages "github.com/bis83/basilico/pkg/oldpack/pages"
)

type Base struct {
	Draw int `json:"draw"`
	Item int `json:"item"`
}

func (p *Base) Set(src *pages.Pages, s *pages.Base) error {
	p.Draw = src.FindDraw(s.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Item = src.FindItem(s.Item)

	return nil
}
