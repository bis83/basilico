package data

import (
	// "fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type Event struct {
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

	Action [][]string `json:"action"`
}

func toInteractNo(s string) int {
	switch s {
	case "always":
		return 1
	case "button":
		return 2
	case "left-stick":
		return 3
	case "right-stick":
		return 4
	default:
		return 0
	}
}

func (p *Event) Set(prj *project.Project, ev *project.Event) error {
	p.Draw = prj.FindDraw(ev.Draw)

	p.X = ev.X
	p.Y = ev.Y
	p.Width = ev.Width
	p.Height = ev.Height
	p.OriginX = ev.OriginX
	p.OriginY = ev.OriginY

	p.Interact = toInteractNo(ev.Interact)
	p.Gamepad = ev.Gamepad
	p.Keyboard = ev.Keyboard

	p.Action = ev.Action

	return nil
}
