package main

import (
	"backend/app/config"
	"backend/app/routes"
	"backend/app/services"
	"fmt"
	"log"

	"github.com/gin-contrib/cors" // Importa el paquete de CORS
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

	// Initialize the Firebase client
	if err := config.InitFirebase(); err != nil {
		fmt.Printf("Error initializing Firebase client: %v\n", err)
		return
	}

	// Initalize the Storage client
	if err := config.InitStorage(); err != nil {
		fmt.Printf("Error initializing Storage client: %v\n", err)
		return
	}

	// Inicializa Firebase (if needed)
	err = config.InitFirebase() // Cambia esta línea
	if err != nil {
		fmt.Printf("Error initializing Firebase: %v\n", err)
		return
	}

	// Inicializa la conexión a la base de datos PostgreSQL
	db := config.InitDatabase()

	// Configura los servicios y controladores
	authService := services.NewAuthService(config.FirebaseAuthClient, db)

	// Crea una instancia de Gin
	r := gin.Default()

	// Configura CORS para permitir solicitudes desde el puerto 5173 y permitir el encabezado "Authorization"
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}         // Agrega el puerto 5173 como origen permitido
	config.AllowHeaders = []string{"Authorization", "Content-Type"} // Permite los encabezados "Authorization" y "Content-Type"
	r.Use(cors.New(config))                                         // Aplica la configuración de CORS a tu router

	// Configura las rutas con Gin
	routes.ConfigureRegisterRoute(r, authService) // Configura la ruta de registro
	routes.ConfigureLoginRoute(r, authService)    // Configura la ruta de inicio de sesión
	routes.ConfigureUserInfoRoute(r, authService) // Configura la ruta de información del usuario

	// Configura y ejecuta tu servidor Gin aquí
	port := ":8080"
	fmt.Printf("Servidor en ejecución en http://localhost%s\n", port)
	log.Fatal(r.Run(port))
}
