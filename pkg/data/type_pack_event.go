package data

import (
	// "fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type Event struct {
	Trigger int        `json:"trigger"`
	Target  string     `json:"target"`
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
	p.Trigger = toTriggerNo(ev.Trigger)
	p.Target = ev.Target
	p.Action = ev.Action
	return nil
}
