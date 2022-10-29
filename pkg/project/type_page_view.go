package project

type View struct {
	Name string   `toml:"name"`
	Com  []string `toml:"com"`

	Draw3D    bool     `toml:"draw3d"`
	CameraMob string   `toml:"camera-mob"`
	Draw      []string `toml:"draw"`
}
