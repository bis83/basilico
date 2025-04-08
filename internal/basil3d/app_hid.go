package basil3d

import (
	"bytes"
	"encoding/json"
)

type AppHID struct {
	Keyboard map[string]*string `json:"keyboard"`
	Mouse    *AppHIDMouse       `json:"mouse"`
	Gamepad  *AppHIDGamepad     `json:"gamepad"`
}
type AppHIDMouse struct {
	Button    []*string `json:"button"`
	MovementX []*string `json:"movementX"`
	MovementY []*string `json:"movementY"`
}
type AppHIDGamepad struct {
	Buttons []*string   `json:"buttons"`
	Axes    [][]*string `json:"axes"`
}

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
