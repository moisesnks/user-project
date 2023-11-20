package routes

import (
	"backend/app/services"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ConfigureUserInfoRoute(router *gin.Engine, authService *services.AuthService) {
	router.GET("/user/info", func(c *gin.Context) {
		// Verifica el token JWT en el encabezado de autorización
		token := c.GetHeader("Authorization")
		// Realiza la verificación del token JWT y obtiene el ID del usuario
		userID, err := authService.VerifyAndExtractUserID(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token JWT no válido"})
			return
		}

		// Utiliza la SDK de admin de Firebase para obtener los datos del usuario por su ID
		user, err := authService.FirebaseAuthClient.GetUser(context.Background(), userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la información del usuario"})
			return
		}

		// Devuelve los datos del usuario como respuesta JSON
		c.JSON(http.StatusOK, user)
	})
}
