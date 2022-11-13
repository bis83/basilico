package project

type Hit struct {
	Name string `toml:"name"`
	Draw string `toml:"draw"`

	Action [][]string `toml:"action"`
}
