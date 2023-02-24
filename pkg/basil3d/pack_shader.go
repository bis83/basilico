package basil3d

func toShaderType(str string) int {
	switch str {
	case "vertex":
		return 0
	case "fragment":
		return 1
	default:
		return -1
	}
}

func (p *Pack) importShader(src *source) error {
	for _, toml := range src.TOML {
		for _, item := range toml.Shader {
			var shader PackMeshShader
			shader.Type = toShaderType(item.Type)
			shader.Content = p.AddContent(item.Src)
			p.Mesh.Shader = append(p.Mesh.Shader, &shader)
		}
	}
	return nil
}
