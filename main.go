package main

import (
	"os"

	"heckel.io/ntfy/v2/cmd"
)

func main() {
	// Configurar argumentos para rodar o servidor
	os.Args = []string{"ntfy", "serve", "--listen-http", ":80", "--behind-proxy"}
	cmd.Execute()
}
