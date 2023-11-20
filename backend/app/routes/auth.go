package routes

import (
	"backend/app/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ConfigureAuthRoutes(router *gin.RouterGroup, authService *services.AuthService) {
	// Ruta de registro que llama al servicio RegisterUser
	router.POST("/register", func(c *gin.Context) {
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

	// Ruta de inicio de sesión que valida un token JWT y redirige al usuario
	router.POST("/login", func(c *gin.Context) {
		var jwtData struct {
			Token string `json:"token"`
		}

		// Parsear el token JWT desde el cuerpo de la solicitud
		if err := c.BindJSON(&jwtData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Token JWT no válido"})
			return
		}

		// Validar el token JWT utilizando el servicio de autenticación
		isValid, err := authService.ValidateJWT(jwtData.Token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al validar el token JWT"})
			return
		}

		if isValid {
			// Redirigir al usuario a la página de Google (personaliza la URL según tus necesidades)
			c.Redirect(http.StatusSeeOther, "https://www.google.cl")
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token JWT no válido"})
		}
	})
}
