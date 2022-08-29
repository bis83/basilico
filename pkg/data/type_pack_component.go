package data

import (
	// "fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type Component struct {
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

func (p *Component) Set(prj *project.Project, c *project.Component) error {
	p.Draw = prj.FindDraw(c.Draw)

	p.X = c.X
	p.Y = c.Y
	p.Width = c.Width
	p.Height = c.Height
	p.OriginX = c.OriginX
	p.OriginY = c.OriginY

	p.Interact = toInteractNo(c.Interact)
	p.Gamepad = c.Gamepad
	p.Keyboard = c.Keyboard

	p.Action = c.Action

	return nil
}