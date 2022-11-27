package project

type View struct {
	Name string    `toml:"name"`
	Com  []string  `toml:"com"`
	Grid *ViewGrid `toml:"grid"`
}

type ViewGrid struct {
	CameraMob string   `toml:"camera-mob"`
	Draw      []string `toml:"draw"`
}
