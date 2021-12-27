package main

import (
	"log"
	"net/http"
)

func root(w http.ResponseWriter, r *http.Request) {

}

func main() {
	log.Println("Message Server Start...")
	http.HandlerFunc("/ws", func(w http.ResponseWriter, r *http.Request) {

	})
	err := http.ListenAndServe(":4321", nil)
	if err != nil {
		log.Fatal(err)
	}
}
