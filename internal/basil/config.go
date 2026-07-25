package basil

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	Dist     *string  `json:"dist"`
	Title    string   `json:"title"`
	Script   []string `json:"script"`
	Minify   bool     `json:"minify"`
	CoreOnly bool     `json:"coreonly"`

	Use    []string `json:"use"`
	Extern []string `json:"extern"`
}

func (p *Config) Read(path string) error {
	var err error
	var data []byte
	data, err = os.ReadFile(path)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(data, p); err != nil {
		return fmt.Errorf("decode %s: %w", path, err)
	}
	return nil
}
