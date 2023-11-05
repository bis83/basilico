package basil3d

import (
	"bytes"
	"encoding/json"
)

func (p *Builder) importSignal(app *App) error {
	data, err := fs.ReadFile("web/json/signal.json")
	if err != nil {
		return err
	}
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&app.Signal); err != nil {
		return err
	}
	return nil
}
