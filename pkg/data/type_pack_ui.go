package data

import (
	"fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type UI struct {
	Draw int `json:"draw"`

	X       int     `json:"x"`
	Y       int     `json:"y"`
	Width   int     `json:"w"`
	Height  int     `json:"h"`
	OriginX float64 `json:"ox"`
	OriginY float64 `json:"oy"`

	Interact int    `json:"interact"`
	Gamepad  string `json:"gamepad"`
	Keyboard string `json:"keyboard"`
}

func toInteractNo(s string) int {
	switch s {
	case "button":
		return 1
	case "left-stick":
		return 2
	case "right-stick":
		return 3
	default:
		return 0
	}
}

func (p *UI) Set(prj *project.Project, ui *project.UI) error {
	p.Draw = prj.FindDraw(ui.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", ui.Draw)
	}

	p.X = ui.X
	p.Y = ui.Y
	p.Width = ui.Width
	p.Height = ui.Height
	p.OriginX = ui.OriginX
	p.OriginY = ui.OriginY

	p.Interact = toInteractNo(ui.Interact)
	p.Gamepad = ui.Gamepad
	p.Keyboard = ui.Keyboard

	return nil
}
