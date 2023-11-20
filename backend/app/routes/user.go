package routes

import (
	"backend/app/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ConfigureUserInfoRoute(router *gin.Engine, authService *services.AuthService) {
	router.GET("/user/info", func(c *gin.Context) {
		// Verifica el token JWT en el encabezado de autorización
		token := c.GetHeader("Authorization")

		// Extraer el user_id del token JWT utilizando el servicio de autenticación
		user_id, err := authService.ExtractUserIDFromToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// Utiliza el servicio de autenticación para obtener los datos del usuario por su ID
		user, err := authService.GetUserInfoByID(user_id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la información del usuario"})
			return
		}

		fmt.Println("Datos del usuario:", user)

		// Devuelve los datos del usuario como respuesta JSON
		c.JSON(http.StatusOK, user)
	})
}
