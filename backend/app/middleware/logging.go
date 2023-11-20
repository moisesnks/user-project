// app/middleware/logging.go

package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Registra información sobre la solicitud
		startTime := time.Now()
		requestMethod := c.Request.Method
		requestPath := c.Request.URL.Path

		// Llama al siguiente manejador en la cadena
		c.Next()

		// Registra información sobre la respuesta
		endTime := time.Now()
		latency := endTime.Sub(startTime)

		// Registra la información en el formato deseado (puedes personalizarlo)
		fmt.Printf("%s %s %v\n", requestMethod, requestPath, latency)
	}
}
