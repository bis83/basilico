package basil3d

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
)

func openStage(path string) (*SrcStage, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc SrcStage
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}

func (p *Builder) readStage(baseDir string) error {
	dir := filepath.Join(baseDir, "stage")
	if !basil.Exists(dir) {
		return nil
	}

	p.Stage = make(map[string]*SrcStage, 0)
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".json" {
			return nil
		}

		doc, err := openStage(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Stage[name] = doc
		fmt.Printf("Stage: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) importStage(app *App) error {
	app.Stage = make(map[string]*AppStage, len(p.Stage))
	for k, v := range p.Stage {
		var p AppStage
		p.Step = make([]*AppStageStep, 0, len(v.Step))
		for _, b := range v.Step {
			var a AppStageStep
			a.Label = b.Label
			a.Event = b.Event
			a.Goto = b.Goto
			a.Solve = b.Solve
			a.Yield = b.Yield
			p.Step = append(p.Step, &a)
		}
		p.Room = make([]*AppStageRoom, 0, len(v.Room))
		for _, b := range v.Room {
			var a AppStageRoom
			a.Data = b.Data
			a.X = b.X
			a.Y = b.Y
			a.Z = b.Z
			a.HA = b.HA
			a.VA = b.VA
			p.Room = append(p.Room, &a)
		}
		p.Mob = make([]*AppStageMob, 0, len(v.Mob))
		for _, b := range v.Mob {
			var a AppStageMob
			a.Data = b.Data
			a.X = b.X
			a.Y = b.Y
			a.Z = b.Z
			a.HA = b.HA
			a.VA = b.VA
			p.Mob = append(p.Mob, &a)
		}
		p.Camera = make([]*AppStageCamera, 0, len(v.Camera))
		for _, b := range v.Camera {
			var a AppStageCamera
			a.X = b.X
			a.Y = b.Y
			a.Z = b.Z
			a.HA = b.HA
			a.VA = b.VA
			a.Fov = b.Fov
			a.Near = b.Near
			a.Far = b.Far
			p.Camera = append(p.Camera, &a)
		}
		p.Light = make([]*AppStageLight, 0, len(v.Light))
		for _, b := range v.Light {
			var a AppStageLight
			a.HA = b.HA
			a.VA = b.VA
			a.Color = b.Color.toFloat()
			a.Ambient0 = b.Ambient0.toFloat()
			a.Ambient1 = b.Ambient1.toFloat()
			p.Light = append(p.Light, &a)
		}
		app.Stage[k] = &p
	}
	return nil
}
