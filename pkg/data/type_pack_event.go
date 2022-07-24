package data

import (
	// "fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type Event struct {
	UI string `json:"ui"`

	Trigger int        `json:"trigger"`
	Action  [][]string `json:"action"`
}

func toTriggerNo(s string) int {
	switch s {
	case "always":
		return 0
	case "button":
		return 1
	default:
		return 0
	}
}

func (p *Event) Set(prj *project.Project, ev *project.Event) error {
	p.UI = ev.UI
	p.Trigger = toTriggerNo(ev.Trigger)
	p.Action = ev.Action
	return nil
}
