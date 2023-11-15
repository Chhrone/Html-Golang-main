package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

var templates = template.Must(template.ParseFiles("templates/home.html"))

type FoodItem struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type Order struct {
	Items []FoodItem `json:"items"`
}

var (
	order      = Order{}
	orderMutex sync.Mutex
)

func main() {
	router := mux.NewRouter()

	// Define routes for different pages
	router.HandleFunc("/", homeHandler).Methods("GET")
	router.HandleFunc("/add-to-order", addToOrderHandler).Methods("POST")
	router.HandleFunc("/order-details", orderDetailsHandler).Methods("GET")

	// Serve static files (e.g., CSS, JS) from the "static" directory
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	fmt.Println("Server is running on :8080")
	http.Handle("/", router)
	http.ListenAndServe(":8080", nil)
}

func renderHTML(w http.ResponseWriter, tmpl string) {
	err := templates.ExecuteTemplate(w, tmpl+".html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	renderHTML(w, "home")
}

func addToOrderHandler(w http.ResponseWriter, r *http.Request) {
	var foodItem FoodItem
	err := json.NewDecoder(r.Body).Decode(&foodItem)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	orderMutex.Lock()
	defer orderMutex.Unlock()

	order.Items = append(order.Items, foodItem)

	w.WriteHeader(http.StatusOK)
}

func orderDetailsHandler(w http.ResponseWriter, r *http.Request) {
	orderMutex.Lock()
	defer orderMutex.Unlock()

	orderJSON, err := json.Marshal(order)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(orderJSON)
}
