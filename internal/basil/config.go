package basil

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	Title        string   `json:"title"`
	ExternScript []string `json:"extern-script"`
	Minify       bool     `json:"minify"`

	Middleware []string `json:"middleware"`
	Script     []string `json:"script"`
	Resource   []string `json:"resource"`
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
