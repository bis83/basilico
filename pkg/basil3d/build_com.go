package basil3d

import (
	"encoding/json"
)

func (p *Builder) importCom(app *App) error {
	data, err := fs.ReadFile("web/json/com.json")
	if err != nil {
		return err
	}
	if err := json.Unmarshal(data, &app.Com); err != nil {
		return err
	}
	return nil
}
