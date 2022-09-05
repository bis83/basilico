package project

type Com struct {
	Name string `toml:"name"`
	Draw string `toml:"draw"`

	X       int     `toml:"x"`
	Y       int     `toml:"y"`
	Width   int     `toml:"width"`
	Height  int     `toml:"height"`
	OriginX float64 `toml:"origin-x"`
	OriginY float64 `toml:"origin-y"`

	Interact string `toml:"interact"`
	Gamepad  string `toml:"gamepad"`
	Keyboard string `toml:"keyboard"`

	Action [][]string `toml:"action"`

	Text *ComText `toml:"text"`
}

type ComText struct {
	Contents string `toml:"contents"`
	Sampler  int    `toml:"sampler"`
}
