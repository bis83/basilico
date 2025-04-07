package basil3d

import (
	"bytes"
	"compress/flate"
	"encoding/base64"
)

type App struct {
	Embed []*string               `json:"embed"`
	JSON  map[string]*interface{} `json:"json"`

	Tile  map[string]*AppTile  `json:"tile"`
	Room  map[string]*AppRoom  `json:"room"`
	Mob   map[string]*AppMob   `json:"mob"`
	Stage map[string]*AppStage `json:"stage"`

	HID   AppHID   `json:"hid"`
	GPU   AppGPU   `json:"gpu"`
	Audio AppAudio `json:"audio"`
}
type AppAudio struct {
}

func (p *App) addEmbed(buf string) int {
	for i, v := range p.Embed {
		if v != nil && *v == buf {
			return i
		}
	}
	i := len(p.Embed)
	p.Embed = append(p.Embed, &buf)
	return i
}

func (p *App) addEmbedBase64(buf []byte, compress bool) (int, error) {
	if compress {
		var b bytes.Buffer
		w, err := flate.NewWriter(&b, flate.BestCompression)
		if err != nil {
			return -1, err
		}
		if _, err := w.Write(buf); err != nil {
			w.Close()
			return -1, err
		}
		w.Close()

		return p.addEmbed(base64.StdEncoding.EncodeToString(b.Bytes())), nil
	} else {
		return p.addEmbed(base64.StdEncoding.EncodeToString(buf)), nil
	}
}

func (p *App) build(src *Source) error {
	p.Embed = append(p.Embed, nil)
	if err := p.buildWGSL(); err != nil {
		return err
	}
	if err := p.buildGLTF(src); err != nil {
		return err
	}
	if err := p.buildJSON(src); err != nil {
		return err
	}
	if err := p.buildHID(); err != nil {
		return err
	}
	if err := p.buildTile(src); err != nil {
		return err
	}
	if err := p.buildRoom(src); err != nil {
		return err
	}
	if err := p.buildMob(src); err != nil {
		return err
	}
	if err := p.buildStage(src); err != nil {
		return err
	}
	return nil
}

func (p *App) buildJSON(src *Source) error {
	p.JSON = src.JSON
	return nil
}
