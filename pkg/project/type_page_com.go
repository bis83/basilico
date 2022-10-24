package project

type Com struct {
	Name string `toml:"name"`

	Rect *ComRect `toml:"rect"`
	Text *ComText `toml:"text"`

	Touch *ComTouch `toml:"touch"`
	Tick  *ComTick  `toml:"tick"`
}

type ComRect struct {
	Draw string `toml:"draw"`

	X       int     `toml:"x"`
	Y       int     `toml:"y"`
	Width   int     `toml:"width"`
	Height  int     `toml:"height"`
	OriginX float64 `toml:"origin-x"`
	OriginY float64 `toml:"origin-y"`
}

type ComText struct {
	Contents string `toml:"contents"`
	Sampler  int    `toml:"sampler"`
}

type ComTouch struct {
	Gamepad  string `toml:"gamepad"`
	Keyboard string `toml:"keyboard"`

	Action [][]string `toml:"action"`
}

type ComTick struct {
	Action [][]string `toml:"action"`
}
