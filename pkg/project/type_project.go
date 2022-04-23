package project

type Project struct {
	Setup   *Setup
	Mesh    []*Mesh
	Texture []*Texture
	Shader  []*Shader
	Stack   []*Stack
}

func (p *Project) Set(setup *Setup, pages []*Page) {
	p.Setup = setup
	for _, page := range pages {
		for _, mesh := range page.Mesh {
			p.Mesh = append(p.Mesh, mesh)
		}
		for _, texture := range page.Texture {
			p.Texture = append(p.Texture, texture)
		}
		for _, shader := range page.Shader {
			p.Shader = append(p.Shader, shader)
		}
		for _, stack := range page.Stack {
			p.Stack = append(p.Stack, stack)
		}
	}
}

func (p *Project) FindMesh(name string) (*Mesh, int) {
	for i, v := range p.Mesh {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindTexture(name string) (*Texture, int) {
	for i, v := range p.Texture {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindShader(name string) (*Shader, int) {
	for i, v := range p.Shader {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}
