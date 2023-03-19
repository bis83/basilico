package basil3d

import (
	"bytes"
	"fmt"
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type TomlDoc struct {
}

func openTomlDoc(path string) (*TomlDoc, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc TomlDoc
	r := bytes.NewReader(data)
	d := toml.NewDecoder(r)
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}
