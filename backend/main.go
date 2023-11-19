package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Configura y ejecuta tu servidor HTTP aquí
	port := ":8080"
	fmt.Printf("Servidor en ejecución en el puerto %s...\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
