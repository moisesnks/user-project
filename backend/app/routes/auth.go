// routes.go

package routes

import (
	"backend/app/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ConfigureRegisterRoute configura la ruta de registro
func ConfigureRegisterRoute(router *gin.Engine, authService *services.AuthService) {
	router.POST("/auth/register", func(c *gin.Context) {
		var userData struct {
			UID   string `json:"uid"`
			Email string `json:"email"`
		}

		// Parsear los datos del usuario desde el cuerpo de la solicitud
		if err := c.BindJSON(&userData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de usuario no válidos"})
			return
		}

		// Registrar al usuario en la base de datos
		if err := authService.RegisterUser(userData.UID, userData.Email); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar usuario"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Usuario registrado correctamente"})
	})
}

// ConfigureLoginRoute configura la ruta de inicio de sesión
func ConfigureLoginRoute(router *gin.Engine, authService *services.AuthService) {
	router.POST("/auth/login", func(c *gin.Context) {
		// Verificar el token JWT en el encabezado de autorización
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token JWT no proporcionado en el encabezado de autorización"})
			return
		}

		// Validar el token JWT utilizando el servicio de autenticación
		isValid, err := authService.ValidateJWT(token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al validar el token JWT"})
			fmt.Println("Error al validar el token JWT:", err)
			return
		}

		fmt.Println("Token JWT is ", isValid)

		if isValid {
			// Enviar una respuesta HTTP 200 con un mensaje de éxito
			c.JSON(http.StatusOK, gin.H{"message": "Inicio de sesión exitoso"})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token JWT no válido"})
		}
	})
}
