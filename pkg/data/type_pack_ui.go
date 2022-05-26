package data

import (
	"fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type UI struct {
	Name string `json:"name"`
	Draw int    `json:"draw"`

	Width  int   `json:"width"`
	Height int   `json:"height"`
	Offset []int `json:"offset"`

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
	p.Name = ui.Name
	if _, i := prj.FindDraw(ui.Draw); i >= 0 {
		p.Draw = i
	} else {
		return fmt.Errorf("Draw Not Found: %s", ui.Draw)
	}

	p.Width = ui.Width
	p.Height = ui.Height
	if len(ui.Offset) == 2 {
		p.Offset = ui.Offset
	} else {
		p.Offset = []int{0, 0}
	}

	p.Interact = toInteractNo(ui.Interact)
	p.Gamepad = ui.Gamepad
	p.Keyboard = ui.Keyboard

	return nil
}
