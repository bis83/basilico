package basil3d

import (
	"bytes"
)

var wgsl = [][]string{
	{
		"web/wgsl/b0.wgsl",
		"web/wgsl/b1.wgsl",
		"web/wgsl/l0.wgsl",
		"web/wgsl/m0.wgsl",
	},
	{
		"web/wgsl/b0.wgsl",
		"web/wgsl/l1.wgsl",
		"web/wgsl/m1.wgsl",
	},
	{
		"web/wgsl/b0.wgsl",
		"web/wgsl/b1.wgsl",
		"web/wgsl/l0.wgsl",
		"web/wgsl/m2.wgsl",
	},
}

type AppWGSL struct {
	Shader []*AppWGSLShader `json:"shader,omitempty"`
}
type AppWGSLShader struct {
	Embed int `json:"embed,omitempty"`
}

func (p *App) buildWGSL() error {
	for _, src := range wgsl {
		var appShader AppWGSLShader
		p.WGSL.Shader = append(p.WGSL.Shader, &appShader)

		var b bytes.Buffer
		for _, path := range src {
			bin, err := fs.ReadFile(path)
			if err != nil {
				return err
			}
			if _, err := b.Write(bin); err != nil {
				return err
			}
		}

		var err error
		appShader.Embed, err = p.addEmbedBase64(b.Bytes(), true)
		if err != nil {
			return err
		}
	}
	return nil
}
