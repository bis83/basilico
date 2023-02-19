package pack

import (
	basil "github.com/bis83/basilico/pkg/basil"
)

type Middleware struct {
}

func (p Middleware) PreBuild(bsl *basil.Basil) error {
	if err := makePack(bsl); err != nil {
		return err
	}
	if err := writePageScript(bsl); err != nil {
		return err
	}
	return nil
}
