package basil

import (
	"bytes"
)

var wgsl = [][]string{
	{
		"web/wgsl/layout0.wgsl",
		"web/wgsl/module0.wgsl",
	},
	{
		"web/wgsl/layout0.wgsl",
		"web/wgsl/layout1.wgsl",
		"web/wgsl/module1.wgsl",
	},
	{
		"web/wgsl/layout0.wgsl",
		"web/wgsl/module2.wgsl",
	},
}

type ArWGSL struct {
	Shader []*ArWGSLShader `json:"shader,omitempty"`
}
type ArWGSLShader struct {
	Embed int `json:"embed,omitempty"`
}

func (p *Archive) buildWGSL() error {
	for _, src := range wgsl {
		var arShader ArWGSLShader
		p.WGSL.Shader = append(p.WGSL.Shader, &arShader)

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
		arShader.Embed, err = p.addEmbedBase64(b.Bytes(), true)
		if err != nil {
			return err
		}
	}
	return nil
}
