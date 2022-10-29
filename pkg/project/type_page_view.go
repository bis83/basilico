package project

type View struct {
	Name   string   `toml:"name"`
	Draw3D bool     `toml:"draw3d"`
	Draw   []string `toml:"draw"`
	Com    []string `toml:"com"`
}
