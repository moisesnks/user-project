package config

import (
	"context"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

var StorageClient *storage.Client

func InitStorage() error {
	ctx := context.Background()

	// Utilizar el mismo archivo de credenciales que para Firebase
	client, err := storage.NewClient(ctx, option.WithCredentialsFile("credentials.json"))
	if err != nil {
		return err
	}

	StorageClient = client
	return nil
}
