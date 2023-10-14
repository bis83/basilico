package basil3d

import (
	"bytes"
)

var wgsl = [][]string{
	[]string{
		"web/wgsl/b0.wgsl",
		"web/wgsl/b1.wgsl",
		"web/wgsl/l0.wgsl",
		"web/wgsl/m0.wgsl",
	},
	[]string{
		"web/wgsl/b0.wgsl",
		"web/wgsl/l1.wgsl",
		"web/wgsl/m1.wgsl",
	},
	[]string{
		"web/wgsl/b0.wgsl",
		"web/wgsl/b1.wgsl",
		"web/wgsl/l0.wgsl",
		"web/wgsl/m2.wgsl",
	},
}

func (p *Builder) importWGSL(app *App) error {
	for _, src := range wgsl {
		var appShader AppGPUShader
		app.GPU.Shader = append(app.GPU.Shader, &appShader)

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
		appShader.Embed, err = app.AddEmbedBase64(b.Bytes(), true)
		if err != nil {
			return err
		}
	}
	return nil
}
