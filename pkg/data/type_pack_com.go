package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Com struct {
	Rect  *ComRect  `json:"rect,omitempty"`
	Text  *ComText  `json:"text,omitempty"`
	Touch *ComTouch `json:"touch,omitempty"`
	Tick  *ComTick  `json:"tick,omitempty"`
}

type ComRect struct {
	Draw int `json:"draw"`

	X       int     `json:"x"`
	Y       int     `json:"y"`
	Width   int     `json:"w"`
	Height  int     `json:"h"`
	OriginX float64 `json:"ox"`
	OriginY float64 `json:"oy"`
}

type ComText struct {
	Contents string `json:"contents"`
	Sampler  int    `json:"s"`
}

type ComTouch struct {
	Gamepad  string     `json:"gamepad"`
	Keyboard string     `json:"keyboard"`
	Action   [][]string `json:"action"`
}

type ComTick struct {
	Action [][]string `json:"action"`
}

func (p *Com) Set(prj *project.Project, c *project.Com) error {
	if c.Rect != nil {
		var a ComRect
		a.Draw = prj.FindDraw(c.Rect.Draw)
		a.X = c.Rect.X
		a.Y = c.Rect.Y
		a.Width = c.Rect.Width
		a.Height = c.Rect.Height
		a.OriginX = c.Rect.OriginX
		a.OriginY = c.Rect.OriginY
		p.Rect = &a
	}
	if c.Text != nil {
		var a ComText
		a.Contents = c.Text.Contents
		a.Sampler = c.Text.Sampler
		p.Text = &a
	}
	if c.Touch != nil {
		var a ComTouch
		a.Gamepad = c.Touch.Gamepad
		a.Keyboard = c.Touch.Keyboard
		a.Action = c.Touch.Action
		p.Touch = &a
	}
	if c.Tick != nil {
		var a ComTick
		a.Action = c.Tick.Action
		p.Tick = &a
	}
	return nil
}
