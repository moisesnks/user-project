// routes.go

package routes

import (
	"backend/app/services"
	"fmt"
	"net/http"
	"strings"

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
		// Extraer el token del encabezado 'Authorization'
		authHeader := c.GetHeader("Authorization")

		// Dividir el encabezado en el espacio ' '
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Encabezado de autorización mal formado o ausente"})
			c.Error(fmt.Errorf("encabezado de autorización mal formado o ausente")) // Use c.Error to log the error
			return
		}

		// El token es la segunda parte del encabezado dividido
		token := parts[1]

		// Extraer el UID del usuario del token JWT
		uid, email, err := authService.ExtractUserDetailsFromToken(token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al extraer detalles del token JWT"})
			c.Error(err) // Use c.Error to log the error
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Inicio de sesión exitoso", "uid": uid, "email": email})
		fmt.Printf("Inicio de sesión exitoso para el usuario con UID: %s, Email: %s\n", uid, email) // Use fmt.Printf to log success for debugging
	})
}
