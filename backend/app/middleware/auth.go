package middleware

import (
	"net/http"

	"context"

	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(client *auth.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtén el token del encabezado de autorización
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token de autenticación no proporcionado"})
			c.Abort()
			return
		}

		// Verificar y decodificar el token JWT utilizando el cliente de Firebase Auth
		token, err := client.VerifyIDToken(context.Background(), tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token de autenticación inválido"})
			c.Abort()
			return
		}

		// Agregar el token decodificado al contexto de Gin
		c.Set("token", token)

		// Token válido, permite que la solicitud continúe
		c.Next()
	}
}
