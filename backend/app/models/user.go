package models

type User struct {
	ID              string `gorm:"primaryKey;column:id"` // Utiliza `gorm:"primaryKey"` si este es tu campo clave
	Nombre          string `gorm:"column:nombre"`
	Apellido        string `gorm:"column:apellido"`
	SegundoApellido string `gorm:"column:segundoapellido"`
	Email           string `gorm:"column:email"` // `uniqueIndex` si el email debe ser único
	RUT             string `gorm:"column:rut"`
	Fono            string `gorm:"column:fono"`
	ImgProfile      string `gorm:"column:img_profile"`
}

// TableName sobrescribe el nombre de la tabla por defecto
func (User) TableName() string {
	return "usuario"
}
