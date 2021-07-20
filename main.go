package main

import (
	basilico "github.com/bis83/basilico/pkg/basilico"
	"log"
)

func main() {
	err := basilico.InitBuildRun()
	if err != nil {
		log.Print(err)
	}
}
