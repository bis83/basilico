package project

type Index struct {
	InitialView string   `toml:"initial-view"`
	GLTF        []string `toml:"gltf"`
}
