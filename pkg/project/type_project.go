package project

type Project struct {
	Cfg     *Config
	Scene   []*Scene
	Mesh    []*Mesh
	Texture []*Texture
	Shader  []*Shader
}

func (p *Project) FindScene(name string) (*Scene, int) {
	for i, v := range p.Scene {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
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
