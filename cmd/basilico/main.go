package main

import (
	"fmt"
	"os"

	"github.com/bis83/basilico/internal/editor"
)

func logError(err error) {
	fmt.Println(err)
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
