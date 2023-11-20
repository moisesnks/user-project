package main

import (
	"backend/app/config"
	"backend/app/middleware"
	"backend/app/routes"
	"backend/app/services"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Carga las variables de entorno desde el archivo .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error al cargar las variables de entorno: ", err)
		return
	}

	// Inicializa Firebase
	err = config.InitFirebase() // Cambia esta línea
	if err != nil {
		fmt.Printf("Error initializing Firebase: %v\n", err)
		return
	}

	// Inicializa la conexión a la base de datos PostgreSQL
	config.InitDatabase()
	db := config.DB
	defer db.Close()

	// Crea una instancia de Gin
	r := gin.Default()

	// Configura los servicios y controladores
	firebaseClient, err := config.GetFirebaseClient() // Cambia esta línea
	if err != nil {
		fmt.Printf("Error initializing Firebase client: %v\n", err)
		return
	}
	authService := services.NewAuthService(firebaseClient, db)

	// Configura las rutas con Gin
	authGroup := r.Group("/auth")
	{
		// Agrega el middleware aquí
		authGroup.Use(middleware.AuthMiddleware(firebaseClient))

		// Luego, configura las rutas de autenticación
		routes.ConfigureAuthRoutes(authGroup, authService)
	}

	// Configura y ejecuta tu servidor Gin aquí
	port := ":8080"
	fmt.Printf("Servidor en ejecución en http://localhost%s\n", port)
	log.Fatal(r.Run(port))
}
