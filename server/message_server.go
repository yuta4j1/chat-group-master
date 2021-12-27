package main

import (
	"log"
	"net/http"
)

func root(w http.ResponseWriter, r *http.Request) {

}

func main() {
	log.Println("Message Server Start...")
	hub := newHub()
	go hub.run()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	err := http.ListenAndServe(":4321", nil)
	if err != nil {
		log.Fatal(err)
	}
}
