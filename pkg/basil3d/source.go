package basil3d

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
	"github.com/qmuntal/gltf"
)

type Source struct {
	GLTF  []*gltf.Document
	JSON  map[string]*interface{}
	Room  map[string]*SrcRoom
	Mob   map[string]*SrcMob
	Stage map[string]*SrcStage
}

type SrcColor struct {
	R *float32 `json:"r"`
	G *float32 `json:"g"`
	B *float32 `json:"b"`
	A *float32 `json:"a"`
}

func (p *SrcColor) toFloat() []float32 {
	var r float32 = 0.0
	var g float32 = 0.0
	var b float32 = 0.0
	var a float32 = 0.0
	if p.R != nil {
		r = *p.R
	}
	if p.G != nil {
		g = *p.G
	}
	if p.B != nil {
		b = *p.B
	}
	if p.A != nil {
		a = *p.A
	}
	return []float32{r, g, b, a}
}

type SrcMesh struct {
	Data    string   `json:"data"`
	X       float32  `json:"x"`
	Y       float32  `json:"y"`
	Z       float32  `json:"z"`
	HA      float32  `json:"ha"`
	VA      float32  `json:"va"`
	Factor0 SrcColor `json:"factor0"`
	Factor1 SrcColor `json:"factor1"`
	Factor2 SrcColor `json:"factor2"`
}

type SrcRoom struct {
	Mesh   []*SrcMesh       `json:"mesh"`
	Layout []*SrcRoomLayout `json:"layout"`
}
type SrcRoomLayout struct {
	Node    []*SrcRoomNode `json:"node"`
	Unit    float32        `json:"unit"`
	Divisor int            `json:"divisor"`
	Indices []int          `json:"indices"`
}
type SrcRoomNode struct {
	Mesh   []int   `json:"mesh"`
	Height float32 `json:"height"`
}

type SrcMob struct {
	Mesh   []*SrcMesh `json:"mesh"`
	Mass   float32    `json:"mass"`
	Radius float32    `json:"radius"`
	Height float32    `json:"height"`
}

type SrcStage struct {
	Step   []*SrcStageStep   `json:"step"`
	Entity []*SrcStageEntity `json:"entity"`
}
type SrcStageStep struct {
	Label string `json:"label,omitempty"`
	Event string `json:"event,omitempty"`
	Goto  string `json:"goto,omitempty"`
	Solve bool   `json:"solve,omitempty"`
	Yield bool   `json:"yield,omitempty"`
}
type SrcStageEntity struct {
	Room   *SrcStageRoom   `json:"room,omitempty"`
	Mob    *SrcStageMob    `json:"mob,omitempty"`
	Camera *SrcStageCamera `json:"camera,omitempty"`
	Light  *SrcStageLight  `json:"light,omitempty"`
}
type SrcStageRoom struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type SrcStageMob struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type SrcStageCamera struct {
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
	Fov  float32 `json:"fov"`
	Near float32 `json:"near"`
	Far  float32 `json:"far"`
}
type SrcStageLight struct {
	HA       float32   `json:"ha"`
	VA       float32   `json:"va"`
	Color    *SrcColor `json:"color"`
	Ambient0 *SrcColor `json:"ambient0"`
	Ambient1 *SrcColor `json:"ambient1"`
}

func (p *Source) read(baseDir string) error {
	if err := p.readGLTF(baseDir); err != nil {
		return err
	}
	if err := p.readJSON(baseDir); err != nil {
		return err
	}
	if err := p.readRoom(baseDir); err != nil {
		return err
	}
	if err := p.readMob(baseDir); err != nil {
		return err
	}
	if err := p.readStage(baseDir); err != nil {
		return err
	}
	return nil
}

func (p *Source) readGLTF(baseDir string) error {
	dir := filepath.Join(baseDir, "gltf")
	if !basil.Exists(dir) {
		return nil
	}
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".gltf" {
			return nil
		}

		doc, err := gltf.Open(path)
		if err != nil {
			return err
		}
		p.GLTF = append(p.GLTF, doc)
		fmt.Printf("GLTF: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func openJSONDoc(path string) (*interface{}, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc interface{}
	if err := json.Unmarshal(data, &doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}

func (p *Source) readJSON(baseDir string) error {
	dir := filepath.Join(baseDir, "json")
	if !basil.Exists(dir) {
		return nil
	}

	p.JSON = make(map[string]*interface{}, 0)
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

		doc, err := openJSONDoc(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.JSON[name] = doc
		fmt.Printf("JSON: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func openRoom(path string) (*SrcRoom, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc SrcRoom
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}
func (p *Source) readRoom(baseDir string) error {
	dir := filepath.Join(baseDir, "room")
	if !basil.Exists(dir) {
		return nil
	}

	p.Room = make(map[string]*SrcRoom, 0)
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

		doc, err := openRoom(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Room[name] = doc
		fmt.Printf("Room: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func openMob(path string) (*SrcMob, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc SrcMob
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}
func (p *Source) readMob(baseDir string) error {
	dir := filepath.Join(baseDir, "mob")
	if !basil.Exists(dir) {
		return nil
	}

	p.Mob = make(map[string]*SrcMob, 0)
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

		doc, err := openMob(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Mob[name] = doc
		fmt.Printf("Mob: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func openStage(path string) (*SrcStage, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc SrcStage
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}
func (p *Source) readStage(baseDir string) error {
	dir := filepath.Join(baseDir, "stage")
	if !basil.Exists(dir) {
		return nil
	}

	p.Stage = make(map[string]*SrcStage, 0)
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

		doc, err := openStage(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Stage[name] = doc
		fmt.Printf("Stage: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}
