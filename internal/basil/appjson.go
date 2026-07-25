package basil

import (
	"bytes"
	"compress/flate"
	"encoding/base64"
	"encoding/json"
)

type App struct {
	Embed []*string               `json:"embed"`
	JSON  map[string]*interface{} `json:"json"`
	WGSL  AppWGSL                 `json:"wgsl"`
	GLTF  AppGLTF                 `json:"gltf"`
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
	return nil
}

func (p *App) buildJSON(src *Source) error {
	p.JSON = src.JSON
	return nil
}

func marshalJSON(v interface{}, minify bool) ([]byte, error) {
	if minify {
		data, err := json.Marshal(v)
		if err != nil {
			return nil, err
		}
		return data, nil
	} else {
		data, err := json.MarshalIndent(v, "", "    ")
		if err != nil {
			return nil, err
		}
		return data, nil
	}
}

func (p *Basil) makeAppJSON() error {
	if p.config.CoreOnly {
		return nil
	}

	var src Source
	if err := src.read(p.BaseDir()); err != nil {
		return err
	}

	// generate app.json
	var app App
	if err := app.build(&src); err != nil {
		return err
	}
	data, err := marshalJSON(app, p.Minify())
	if err != nil {
		return err
	}
	p.AddFile("app.json", data)

	return nil
}
