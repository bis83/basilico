package basil3d

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
)

func openFunc(path string) (*AppFunc, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc AppFunc
	if err := json.Unmarshal(data, &doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}

func (p *Builder) readFunc(baseDir string) error {
	dir := filepath.Join(baseDir, "func")
	if !basil.Exists(dir) {
		return nil
	}

	p.Func = make(map[string]*AppFunc, 0)
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".json" {
			return nil
		}

		doc, err := openFunc(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Func[name] = doc
		fmt.Printf("Func: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) importFunc(app *App) error {
	app.Func = p.Func
	return nil
}
