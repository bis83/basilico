package basil3d

import (
	"encoding/json"
)

func (p *Builder) importSignal(app *App) error {
	data, err := fs.ReadFile("web/json/signal.json")
	if err != nil {
		return err
	}
	if err := json.Unmarshal(data, &app.Signal); err != nil {
		return err
	}
	return nil
}
