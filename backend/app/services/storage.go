package services

import (
	"backend/app/config"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
)

func UploadFile(img image.Image, filename string, format string) (string, error) {
	ctx := context.Background()
	bucketName := os.Getenv("FIREBASE_STORAGE_BUCKET")

	// Asegúrate de incluir la carpeta en la ruta del objeto
	objectName := fmt.Sprintf("imgs_profile/%s", filename)

	// Crear una instancia del objeto en el bucket
	object := config.StorageClient.Bucket(bucketName).Object(objectName)

	// Verificar si el archivo ya existe y eliminarlo si es así
	if _, err := object.Attrs(ctx); err == nil {
		// El archivo existe, borrarlo
		if err := object.Delete(ctx); err != nil {
			return "", fmt.Errorf("error al eliminar el archivo existente: %v", err)
		}
	}

	// Subir el nuevo archivo
	wc := object.NewWriter(ctx)
	wc.CacheControl = "no-cache" // Establecer CacheControl en no-cache

	// Manejar diferentes formatos de imagen
	switch format {
	case "jpeg", "jpg":
		if err := jpeg.Encode(wc, img, nil); err != nil {
			wc.Close()
			return "", err
		}
	case "png":
		if err := png.Encode(wc, img); err != nil {
			wc.Close()
			return "", err
		}
	default:
		wc.Close()
		return "", fmt.Errorf("formato de imagen no soportado")
	}

	if err := wc.Close(); err != nil {
		return "", err
	}

	// Generar y devolver el URL del archivo subido con el parámetro adicional para ignorar el caché
	url := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName)
	return url, nil
}
