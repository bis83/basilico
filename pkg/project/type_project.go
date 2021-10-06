package project

type Project struct {
	Cfg     *Config
	Scene   map[string]*Scene
	Mesh    map[string]*Mesh
	Texture map[string]*Texture
	Shader  map[string]*Shader
}
