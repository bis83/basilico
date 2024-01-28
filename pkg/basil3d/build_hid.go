package basil3d

import (
	"bytes"
	"encoding/json"
)

func (p *Builder) importHID(app *App) error {
	data, err := fs.ReadFile("web/json/hid.json")
	if err != nil {
		return err
	}
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&app.HID); err != nil {
		return err
	}
	return nil
}
