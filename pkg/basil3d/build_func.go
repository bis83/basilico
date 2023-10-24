package basil3d

import (
	"encoding/json"
)

func (p *Builder) importFunc(app *App) error {
	data, err := fs.ReadFile("web/json/func.json")
	if err != nil {
		return err
	}
	if err := json.Unmarshal(data, &app.Func); err != nil {
		return err
	}
	return nil
}
