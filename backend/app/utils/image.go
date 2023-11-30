package utils

import (
	"errors"
	"image"
	"mime/multipart"
	"strings"

	"github.com/disintegration/imaging"
)

// Valida y escala la imagen. Devuelve un objeto image.Image procesado, el formato de la imagen y un error, si ocurre.
func ValidateAndScaleImage(file multipart.File, header *multipart.FileHeader) (image.Image, string, error) {
	// Obtener el tipo de archivo de la cabecera
	contentType := header.Header.Get("Content-Type")

	// Verificar que el tipo de archivo sea una imagen admitida (jpg, jpeg, png o webp)
	if !strings.HasPrefix(contentType, "image/") {
		return nil, "", errors.New("el archivo no es una imagen")
	}

	// Crear un límite de tamaño de archivo para evitar cargar imágenes demasiado grandes
	const maxFileSize = 2 << 20 // 2 MB
	if header.Size > maxFileSize {
		return nil, "", errors.New("el archivo excede el tamaño máximo permitido")
	}

	// Decodificar la imagen
	img, format, err := image.Decode(file)
	if err != nil {
		return nil, "", err
	}

	// Escalar la imagen si es necesario
	maxWidth := 1024
	maxHeight := 1024
	img = scaleImage(img, maxWidth, maxHeight)

	return img, format, nil
}

// Función para escalar una imagen a un tamaño máximo
func scaleImage(img image.Image, maxWidth, maxHeight int) image.Image {
	// Escalar la imagen manteniendo la proporción
	img = imaging.Resize(img, maxWidth, maxHeight, imaging.Lanczos)
	return img
}
