package services

import (
	"backend/app/models"
	"errors"
	"log"
	"reflect"

	"gorm.io/gorm"
)

func GetUserByID(db *gorm.DB, userID string) (*models.User, error) {
	var user models.User

	// Busca el usuario por ID en la base de datos
	result := db.First(&user, "id = ?", userID)

	// Comprueba si se encontró un registro
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("usuario no encontrado")
	}

	// Comprueba si hubo algún otro error durante la búsqueda
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func UpdateUser(db *gorm.DB, userID string, updatedUser *models.User) error {
	existingUser, err := GetUserByID(db, userID)
	if err != nil {
		log.Printf("Error al obtener el usuario por ID: %v\n", err)
		return err
	}

	// Usa la reflexión para verificar qué campos están presentes y actualizar solo esos campos
	val := reflect.ValueOf(*updatedUser)
	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		if field.Interface() != reflect.Zero(field.Type()).Interface() {
			name := val.Type().Field(i).Name
			existingVal := reflect.ValueOf(existingUser).Elem().FieldByName(name)
			if existingVal.IsValid() && existingVal.CanSet() {
				existingVal.Set(field)
			}
		}
	}

	result := db.Save(existingUser)
	if result.Error != nil {
		log.Printf("Error al guardar el usuario actualizado: %v\n", result.Error)
		return result.Error
	}

	log.Println("Usuario actualizado con éxito en la base de datos")
	return nil
}
