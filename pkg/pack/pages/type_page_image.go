package project

type Image struct {
	Name    string `toml:"name"`
	Source  string `toml:"src"`
	Sampler int    `toml:"sampler"`
}
