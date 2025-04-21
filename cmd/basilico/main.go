package main

import (
	"errors"
	"fmt"
	"os"

	"github.com/bis83/basilico/internal/editor"
	toml "github.com/pelletier/go-toml/v2"
)

func logError(err error) {
	fmt.Println(err)

	var derr1 *toml.DecodeError
	if errors.As(err, &derr1) {
		fmt.Println(derr1.String())
	}
	var derr2 *toml.StrictMissingError
	if errors.As(err, &derr2) {
		fmt.Println(derr2.String())
	}
}

func main() {
	path := "."
	args := []string{"clean", "build", "serve"}
	if len(os.Args) > 1 {
		path = os.Args[1]
	}
	if len(os.Args) > 2 {
		args = os.Args[2:]
	}

	err := editor.Run(path, args)
	if err != nil {
		logError(err)
	}
}
