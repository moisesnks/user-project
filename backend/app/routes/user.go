package routes

import (
	"backend/app/models"
	"backend/app/services"
	"backend/app/utils"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func ConfigureUserInfoRoute(router *gin.Engine, authService *services.AuthService) {
	router.GET("/user/info", func(c *gin.Context) {
		// Extraer el token del encabezado 'Authorization'
		authHeader := c.GetHeader("Authorization")

		// Dividir el encabezado en el espacio ' '
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Printf("Encabezado de autorización mal formado o ausente: %s\n", authHeader)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Encabezado de autorización mal formado o ausente"})
			c.Error(fmt.Errorf("encabezado de autorización mal formado o ausente"))
			return
		}

		// El token es la segunda parte del encabezado dividido
		token := parts[1]

		// Extraer el UID y email del usuario del token JWT
		uid, email, err := authService.ExtractUserDetailsFromToken(token)
		if err != nil {
			log.Printf("Error al extraer detalles del token JWT: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al extraer detalles del token JWT"})
			c.Error(err)
			return
		}

		log.Printf("Token verificado con éxito. UID: %s, Email: %s\n", uid, email)

		// Utiliza la función GetUserById del authService para obtener los datos del usuario por su UID
		user, err := services.GetUserByID(authService.DB, uid)
		if err != nil {
			log.Printf("Error al obtener la información del usuario para UID: %s, Error: %v\n", uid, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la información del usuario"})
			return
		}

		fmt.Printf("Información obtenida para el usuario con UID: %s, Email: %s\n", uid, email) // Use fmt.Printf to log success for debugging

		// Devuelve los datos del usuario como respuesta JSON
		c.JSON(http.StatusOK, user)
	})
	router.PATCH("/user/update", func(c *gin.Context) {
		// Extraer el token del encabezado 'Authorization'
		authHeader := c.GetHeader("Authorization")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Println("Error: Encabezado de autorización mal formado o ausente")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Encabezado de autorización mal formado o ausente"})
			return
		}
		token := parts[1]

		// Extraer el UID del usuario del token JWT
		uid, _, err := authService.ExtractUserDetailsFromToken(token)
		if err != nil {
			log.Printf("Error al extraer detalles del token JWT: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al extraer detalles del token JWT"})
			return
		}

		// Deserializar el cuerpo de la solicitud en un objeto User
		var updatedUser models.User
		if err := c.BindJSON(&updatedUser); err != nil {
			log.Printf("Error al procesar los datos enviados: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error al procesar los datos enviados"})
			return
		}

		// Llamar a la función UpdateUser con el UID y los datos actualizados
		if err := services.UpdateUser(authService.DB, uid, &updatedUser); err != nil {
			log.Printf("Error al actualizar la información del usuario: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la información del usuario"})
			return
		}

		log.Println("Información del usuario actualizada con éxito")
		c.JSON(http.StatusOK, gin.H{"message": "Información del usuario actualizada con éxito"})
	})
	router.POST("/user/upload-image", func(c *gin.Context) {
		// Extraer el token y obtener el UID del usuario
		authHeader := c.GetHeader("Authorization")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			// Comentario de depuración
			log.Println("Error: Encabezado de autorización mal formado o ausente")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Encabezado de autorización mal formado o ausente"})
			return
		}
		token := parts[1]

		_, _, err := authService.ExtractUserDetailsFromToken(token)
		if err != nil {
			// Comentario de depuración
			log.Printf("Error al extraer detalles del token JWT: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al extraer detalles del token JWT"})
			return
		}

		// Comentario de depuración
		log.Println("Token JWT válido")

		// Obtener el archivo de la solicitud
		file, header, err := c.Request.FormFile("file")
		if err != nil {
			// Comentario de depuración
			log.Printf("Error al obtener el archivo: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "No se pudo obtener el archivo"})
			return
		}

		// Comentario de depuración
		log.Printf("Archivo recibido: %s\n", header.Filename)

		// Recuperar el nombre del archivo del formulario
		filename := c.PostForm("filename")
		if filename == "" {
			// Comentario de depuración
			log.Println("Error: Nombre de archivo faltante")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Nombre de archivo faltante"})
			return
		}

		// Comentario de depuración
		log.Printf("Nombre de archivo: %s\n", filename)

		// Validar y escalar la imagen
		img, format, err := utils.ValidateAndScaleImage(file, header)
		if err != nil {
			// Comentario de depuración
			log.Printf("Error al procesar la imagen: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Error al procesar la imagen: %v", err)})
			return
		}

		// Comentario de depuración
		log.Println("Imagen validada y escalada")

		// Subir la imagen al bucket
		url, err := services.UploadFile(img, filename, format)
		if err != nil {
			// Comentario de depuración
			log.Printf("Error al subir la imagen: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error al subir la imagen: %v", err)})
			return
		}

		// Comentario de depuración
		log.Printf("Imagen subida con éxito, URL: %s\n", url)

		// Devolver la URL de la imagen al cliente
		c.JSON(http.StatusOK, gin.H{"url": url})
	})
}
