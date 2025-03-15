package basil3d

import (
	"bytes"
	"encoding/json"
)

func (p *App) buildHID() error {
	data, err := fs.ReadFile("web/json/hid.json")
	if err != nil {
		return err
	}
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&p.HID); err != nil {
		return err
	}
	return nil
}
